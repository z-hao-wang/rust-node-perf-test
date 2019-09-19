neon build --release && node --max_old_space_size=10240 ./rustTest.js

## result
// for json parse
downcast cost 132ms
parse json cost 629ms
set return value cost 4093ms
====rust len=2332751 took= 5228
====js len=2332751 took= 1133


// for sum
downcast cost 1795ms
sum cost 581ms
====rust sum=11617583773.451733 took= 2480
====js sum=11617583773.451733 took= 242