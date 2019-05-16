import React, { Component } from 'react';

interface IProp {
    _change: () => void;
}

export default class DefaultComponent extends Component {
    constructor(props: IProp) {
        super(props);
    }

    private render() {
        return <h1>hello</h1>;
    }

    private componentDidMount() {
    }

    private shouldComponentUpdate() {
        //return false; // 模块只能被初始化一次，不允许更新
    }
}
