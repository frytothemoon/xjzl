$(function () {
    const user = {
        firstName: 'z',
        lastName: 'zc'
    };
    const array1 = [1, 2, 3, 4];
    const [first, second] = array1;//数组的解构
    const input = {
        left: '1',
        right: '2',
        top: '3',
        bottom: '4'
    };
    let funcs = [
        {
            left: '1',
            right: '2',
            top: '3',
            bottom: '4'
        }, {
            left: '5',
            right: '6',
            top: '7',
            bottom: '8'
        }
    ];
    // for (var i = 0; i < 10; i++) {//禁止循环中的方法改变变量
    //     funcs[i] = function () {
    //         return i;
    //     };
    // };

    funcs.map((x) => {//使用匿名函数时选择箭头函数
        x.left = x.right;
        return x;
    });

    //如果函数体包含一个单独的语句，返回一个没有副作用的 expression ， 省略括号并使用隐式
    //返回。否则，保留括号并使用 return 语句
    array1.map(number => `this string contains ${number}`);
    array1.map((number, index) => ({
        [index]: number
    }));
    var pq = new PeekableQueue([333, 2, 3]);

    const luke = new Jedi({ name: 'luke' });
    luke.jump().setHeight(50);

    const rey = new Rey({ name: 'luke' });

    const sum = array1.reduce((total, value, index) => total += value, 0);
    let sum1 = 0;
    for (let num of array1) {//使用for-of/for-in
        sum1 += num;
    }


    const increasedByOne = array1.map((num) => num + 1);//functional
    const isJedi = getJediProp('luke1');

    const binary = 2 ** 10;//指数运算

    //(function ex(){let a=b=c=1;}());//a undefined b,c变全局变量

    const array2 = [1, 3, , 4, 5, , 7, ];
    let numPlus = 0;//减少使用++ --
    numPlus += 1;
    numPlus -= 1;

    const sum2 = array2.reduce((acc, val) => acc + val, 0);

    //const truthyCount = array2.filter((val)=>val>4);
    const truthyCount = array2.filter(Boolean).length;
    // TODO: 要做的事
    // FIXME: 要改的事
    const s = { a: 's', b: 's', c: 's', };

    const reviewScore = 9;
    const totalScore = String(reviewScore);
    
    const inputValue = '4';
    //const val = Number(inputValue);
    //const val = parseInt(inputValue,10);
    //const val = inputValue >> 0; 速度更快，但不推荐
    array1.sort((x,y)=>{return y-x});

    const age = 0;
    const hasAge = Boolean(age);

    
});



//函数声明提升其名称和函数体
function exampleDeclare() {
    superPower(); // => Flying
    function superPower() {
        console.log('Flying');
    }
}

//命名函数表达式提升的是变量名，而不是函数名或者函数体
function exampleName() {
    console.log(named); // => undefined
    named(); // => TypeError named is not a function
    superPower(); // => ReferenceError superPower is not defined
    var named = function superPower() {
        console.log('Flying');
    };
}

//匿名函数表达式提升变量名，而不是函数赋值
function anonymousExample() {
    console.log(anonymous); // => undefined
    anonymous(); // => TypeError anonymous is not a function
    var anonymous = function () {
        console.log('anonymous function expression');
    };
}

function up() {
    console.log(upup);
    var upup = '1';
}

const luke1 = {
    jedi: true,
    age: 28,
}

//使用变量访问属性时，使用 [] 表示法
function getJediProp(prop) {
    return luke1[prop];
}

//在访问和使用对象的多个属性的时候使用对象的解构
function getFullName(user) {
    const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
}

//使用字符串模板代替字符串拼接
function sayHi(name) {
    return `say Hi to ${name}`;
}

function processInput(input) {
    const left = input.left + 1;
    const right = input.right + 1;
    const top = input.top + 1;
    const bottom = input.bottom + 1;
    return { left, right, top, bottom };
}

function block(user) {
    let test;
    if (user) {
        test = () => {
            console.log('shit');
        }
    }
    test();
}

//不要定义一个arguments参数，影响arguments数组使用
function arg(name, options, arguments) {
    console.log(name);//arg
    console.log(options);
    console.log(arguments[0]);
}

//使用rest语法...代替类数组的arguments，rest参数是一个真正的数组
function concatenateAll(...args) {
    return args.join('');
}

//使用默认的参数语法，而不是改变函数参数 把默认参数放在最后
function handleThings(opts = {}) {
    return opts;
}

function noParamReassign(obj) {
    const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
}

//不要赋值参数
function noParamReassign2(a) {
    const b = a || 1;
}

class Queue {
    constructor(contents = []) {
        this.queue = [...contents];
    }
    pop() {
        const value = this.queue[0];
        this.queue.splice(0, 1);
        return value;
    }
}

class PeekableQueue extends Queue {
    peek() {
        return this.queue[0];
    }
}

class Jedi {
    constructor(options = {}) {
        this.name = options.name || 'no name';
    }
    getName() {
        return this.name;
    }
    toString() {
        return `Jedi - ${this.getName()}`;
    }
    jump() {
        this.jumping = true;
        return this;
    }

    setHeight(height) {
        this.height = height;
        return this;
    }
}

class Rey extends Jedi {
    constructor(...args) {
        super(...args);
        this.name = 'Rey';
    }
}

