#[macro_use]
extern crate neon;
extern crate serde;
extern crate neon_serde;
extern crate serde_derive;
extern crate serde_json;
extern crate rayon;
extern crate time;

use std::time::{SystemTime, UNIX_EPOCH};
use time::PreciseTime;
use std::time::{Duration, Instant};
use rayon::prelude::*;
use std::thread;
use neon::prelude::*;
use std::sync::{Mutex, RwLock, Arc};
use serde::{Serialize, Deserialize};
use serde_json::{ Result };

#[derive(Serialize, Deserialize, Clone)]
struct MyDoc {
    r: f32,
    s: String,
    ts: String,
}
const NTHREADS: usize = 4;

fn json_parse(mut cx: FunctionContext) -> JsResult<JsValue> {
    // Convert a JsArray to a Rust Vec
    let start = Instant::now();

    let str_input = match cx.argument_opt(0) {
        Some(arg) => arg.downcast::<JsString>().or_throw(&mut cx)?.value(),
        // Default to "John Doe" if no value is given
        None => "[]".to_string(),
    };

    println!("downcast cost {}ms", start.elapsed().as_millis());
    let start2 = Instant::now();
    let res: Result<Vec<MyDoc>> = serde_json::from_str(&str_input);
    println!("parse json cost {}ms", start2.elapsed().as_millis());
    let start3 = Instant::now();
    match res {
        Ok(docs) => {
            let ret = Ok(neon_serde::to_value(&mut cx, &docs)?);
            println!("set return value cost {}ms", start3.elapsed().as_millis());
            return ret;
        },
        Err(e) => {
            println!("process doc err {}", e);
        }
    }

    let empty_res: Vec<String> = Vec::new();
    return Ok(neon_serde::to_value(&mut cx, &empty_res)?);
}

fn sum(mut cx: FunctionContext) -> JsResult<JsValue> {
    let start = Instant::now();
    let arr_data: Handle<JsArray> = cx.argument(0)?;
    let input_vec: Vec<Handle<JsValue>> = arr_data.to_vec(&mut cx)?;
    let mut sum: f64 = 0.0;
    println!("downcast cost {}ms", start.elapsed().as_millis());
    let start2 = Instant::now();
    input_vec.iter().for_each(|js_value| {
        sum += js_value
            .downcast::<JsNumber>()
            .unwrap_or(cx.number(0.0))
            // Get the value of the unwrapped value
            .value();
    });
    println!("sum cost {}ms", start2.elapsed().as_millis());
    return Ok(neon_serde::to_value(&mut cx, &sum)?);
}

fn no_action(mut cx: FunctionContext) -> JsResult<JsValue> {
    let empty_res: Vec<String> = Vec::new();
    return Ok(neon_serde::to_value(&mut cx, &empty_res)?);
}

register_module!(mut cx, {
    cx.export_function("JSONparse", json_parse)?;
    cx.export_function("sum", sum)?;
    cx.export_function("noAction", no_action)?;
    Ok(())
});
