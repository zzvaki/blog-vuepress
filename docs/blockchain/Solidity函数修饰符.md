---
title: Solidity函数修饰符
---

# Solidity函数修饰符

## 可见性修饰符

我们有决定函数何时和被谁调用的可见性修饰符

- `private` 意味着它只能被合约内部调用
- `internal` 就像 `private` 但是也能被继承的合约调用
- `external` 只能从合约外部调用
- `public` 可以在任何地方调用，不管是内部还是外部

## 状态修饰符

告诉我们函数如何和区块链交互

- `view` 运行这个函数不会更改和保存任何数据
- `pure` 这个函数不但不会往区块链写数据，它甚至不从区块链读取数据。

这两种状态修饰符在被从合约外部调用的时候都不花费任何gas（但是它们在被内部其他函数调用的时候将会耗费gas）

## 自定义修饰符 modifiers

- `modifiers` 对于这些修饰符我们可以自定义其对函数的约束逻辑。