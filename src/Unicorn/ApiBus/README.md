Api调用总线，使用方式如下：

```javascript
/**
 * 自定义Api描述类，用于表达Api的入参和返回值类型，必须继承自BaseApiDesc。
 * 类内无需其他实现。
*/
class AddApiDesc extends BaseApiDesc<{ num1: number, num2: number }, number> {}

// ----------
class ApiProvider {
    constructor() {
        this.add = this.add.bind(this);
        // 对外提供Api，必须传入Api描述类以及一个方法。
        apiBus.registerApi(AddApiDesc, this.add);
    }

    private add({ num1, num2 }): number {
        return num1 + num2;
    }
}

class ApiConsumer {
    construcor() {
        // 使用Api，通过Api描述类传入入参。
        const result = apiBus.callApi(new AddApiDesc({ num1: 3, num2: 5 })); // result = 8。
    }
}
```