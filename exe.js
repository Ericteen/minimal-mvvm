import { MV } from './src/index';

const callback = (newVal, oldVal, path) => {
  console.log(`NewValue: ${newVal} --- OldValue: ${oldVal} --- path: ${path}`);
}

let data = {
  a: 1,
  lv1: {
    b: 'string',
    c: [{e: 30}, 1, 2, 3],
    lv2: {
      d: 4,
    },
  },
}

const m = new MV(data, callback);

// data.a = 10;
// data.lv1.b = 'xxx';
// data.lv1.lv2.d = 10;
data.lv1.c.push(12);
