---
title: "计科导下-02：任务的分解与组合"
draft: false
author: "25届cs一组课代表李凯锋"
categories: ["学习笔记"]
tags: ["cs101"]
math: true
description: "基于徐老师的课件和课堂录播，对课件里的内容进行二次补充"
summary: "将课堂讲述的知识进行分模块，再在对应模块里面对具体的知识进行二次阐述"
---


> **💡 课程摘要 / Summary**
> *本文档为大湾区大学（GBU）《计算机科学导论（下）》第二周课程笔记。核心探讨了如何通过**自定义函数**实现逻辑抽象，深入底层理解代码在计算机中的物理映射（**内存模型**），并运用数学逻辑（**结构归纳法**、**递推式与主方法**）来严格验证代码的正确性与评估算法性能。*

---
## 课件纵览与模块简述：
![课件概述](/posts/images/cs101_class2_summary/1.png)
![课件回顾](/posts/images/cs101_class2_summary/2.png)

## 📍 模块一：从对象到函数抽象

### 1.1 Python 中的“一切皆对象”
* **对象三元组 (The Object Triad)：**
    * `ID` (身份标识)：[全局唯一且不变的特性]
    * `Type` (类型)：[决定了对象可能的值和允许的操作]
    * `Value` (值)：[值的内容，区分**可变与不可变**]
* **可变性 (Mutability) 区分：**
    * 🟢 **可变对象 (Mutable)：** [举例：List, Dict 等，记录其内存特性]
    * 🔴 **不可变对象 (Immutable)：** [举例：String, Tuple 等，尝试修改会报什么错]

### 1.2 函数抽象的本质
![课件引入](/posts/images/cs101_class2_summary/4.png)
* **从变量到函数的升维：**
    * **变量：** 赋名表达式 (Named Expression)，用**标识符**指代值。
    * **函数：** 赋名代码块 (Named Code Block)，用函数名指代逻辑，实现**一处定义，多处使用**。
![课件引入](/posts/images/cs101_class2_summary/7.png)
* **优雅的错误处理 (Graceful Error Handling)：**
    * **代码范例：** 
    ``` python
    def show_obj(x,v):
    """ Show id, len, type, value of x befor and after x.append(v).
    Use try-except to handle error more gracefully."""
    try:
        print(id(x),len(x),type(x),x)
        x.append(v)
        print(id(x),len(x),type(x),x)
    except:
        print(repr(x),'is not a list, cannot append!')]
    ```
---

## 🧠 模块二：揭开黑盒：内存模型与逐步执行
![课件引入](/posts/images/cs101_class2_summary/6.png)

### 2.1 OS 四大内存段映射

| 内存段 (Segment) | 核心存储内容 | 物理/逻辑特性 |
| :--- | :--- | :--- |
| **Stack (栈)** | [函数调用上下文、局部变量等] | 先进后出 (LIFO)，自动销毁 |
| **Heap (堆)** | [程序的动态数据、对象实例等] | 动态分配，随机存取 |
| **Data (数据段)** | [静态数据、全局常量] | 程序运行期常驻 |
| **Text (代码段)** | [编译后的程序指令代码] | 只读，防止被篡改 |

### 2.2 栈帧 (Stack Frame) 的生命周期
* **入栈 (Call)：** [描述调用自定义函数时，参数传递与新栈帧建立的过程]
* **出栈 (Return)：** [描述函数执行完毕，返回值传递与栈帧销毁的过程]

### 2.3 在python tutor 里面实操复盘，理解内存模型和逐步执行

> 🛠️ **实操复盘区：**
课件里面使用的代码，请自行粘贴到 python tutor 里面逐步执行，观察输出：
``` python
def show_obj(x, v):
    print(id(x), len(x), type(x), x)
    x.append(v)
    print(id(x), len(x), type(x), x)

L = [2, 3]
T = (L, 'Hi!')
show_obj(L, 5)
show_obj(T[0], 7)
show_obj(T[1], 11)
show_obj(T, 13)
```

![课件整理](/posts/images/cs101_class2_summary/8.png)
> 阶段一：全局初始化（变量即引用）
* 观察： 赋值语句 L = [2, 3] 和 T = (L, 'Hi!') 执行后，栈区 (Stack) 创建了全局帧 (Global Frame) 。
* 洞察： 变量本身不存储数据，只是作为引用 (Reference) 绑定到堆区 (Heap) 中实际创建的列表 (List) 和元组 (Tuple) 对象上 。
![课件整理](/posts/images/cs101_class2_summary/9.png)
> 阶段二：函数调用与可变对象修改 (Mutable Object)
* 观察： 调用 show_obj(L, 5) 时，栈区弹出了一个新的函数栈帧。此时局部变量 x 和全局变量 L 指向了堆区里的同一个列表对象 。
* 洞察： 当执行 x.append(5) 时，由于列表是可变对象 (Mutable Object) ，堆区中的原对象被直接“原地”修改为 [2, 3, 5]，对象的标识符 (Identity/ID) 保持不变 。函数执行完毕返回后，该栈帧随之销毁 。
![课件整理](/posts/images/cs101_class2_summary/10.png)
> 阶段三：不可变对象操作与崩溃 (Immutable Object)
* 观察： 调用 show_obj(T[1], 11) 时，局部变量 x 指向了元组中的字符串对象 'Hi!' 。
* 洞察： 尝试执行 append 时，由于字符串是不可变对象 (Immutable Object) ，它根本没有定义修改自身状态的操作。这直接触发了 AttributeError 异常，导致程序崩溃 (Program Crashes) 。这深刻揭示了对象类型 (Type) 严格规定了其允许执行的操作 。

---

## 📐 模块三：降维打击：结构归纳法 (Structural Induction)

### 3.1 递归数据类型 (Recursive Data Types)
* **基础情况 (Base Case)：** [记录类型的最简起步状态，例如空字符串 `''`]
* **构造情况 (Constructor Case)：** [记录如何由简至繁构造复杂数据，例如在一个字符串前加上字符 `'u'` 变成 `'u' + s`]

![课件问题引入](/posts/images/cs101_class2_summary/11.png)

### 3.2 数学归纳法复习以及迁移到结构归纳法
* 1. 高中数学回忆：什么是数学归纳法 (Mathematical Induction)？想象我们要向一个高中生解释如何推倒一列无限长的多米诺骨牌。我们不需要一块一块地去验证它们会不会倒，只需要在逻辑上保证两件事：**起步点（基础情况）：** 我能推倒第一块骨牌（即证明 $n=1$ 或 $n=0$ 时命题 $P(n)$ 成立）。
**传递性（归纳步骤）：** 只要任意一块骨牌（第 $k$ 块）倒下，它必定能推倒下一块（第 $k+1$ 块）。即假设 $P(k)$ 成立，必然能推导出 $P(k+1)$ 成立。只要这两点确立，这列无限长的骨牌注定会全部倒下。这就是用来证明与自然数 (Natural Numbers) 相关命题的绝佳工具。
![课件问题引入](/posts/images/cs101_class2_summary/12.png)
* 2. 认知升级：为什么计算机科学需要结构归纳法 (Structural Induction)？到了大学阶段，我们要处理的不再仅仅是一维的自然数，而是复杂的递归数据类型 (Recursive Data Types)（比如字符串、列表、树结构）。自然数是通过“+1”这个操作不断生长、向后延伸的；而字符串是通过“拼接字符”这个构造操作不断变长的。既然它们的“生长方式”底层都是递归的，我们自然可以把多米诺骨牌的逻辑平移过来。结构归纳法，本质上就是把数学归纳法中的“找下一个数字”，升级为“找下一步的构造器 (Constructor) 操作”。
* 3. 核心概念一一对应对照表 (Mapping the Concepts)：为了深刻理解两者的等价关系，我们在写证明题时，必须在脑海中完成以下映射：

| 核心逻辑要素 | 数学归纳法 (Math Induction) | 结构归纳法 (Structural Induction) |
| :--- | :--- | :--- |
| **证明的目标 (Target)** | 证明命题对所有**自然数** $\mathbb{N}$ 成立 | 证明命题对全体该**递归数据类型**的对象成立 |
| **基础情况 (Base Case)** | 证明起始数字成立 (例如 $n=0$) | 证明最基础的、不可分割的数据实例成立 (例如空字符串 `''`) |
| **归纳假设 (Hypothesis)** | 假设命题对某个整数 $k$ 成立，即 $P(k)$ 为真 | 假设命题对某个通过构造产生的数据对象 $r$ 成立，即 $P(r)$ 为真 |
| **递推/构造步 (Step)** | 基于 $P(k)$，证明 $P(k+1)$ 依然成立 | 基于 $P(r)$，证明对 $r$ 施加**构造操作**后产生的新对象依然成立 (例如 $P('u' + r)$) |
| **生长的驱动力** | 算术加法：`+ 1` | 构造器操作：例如 `+ 'u'` (字符串拼接) 或 `.append()` |



### 3.3 结构归纳法证明模板
![课件问题引入](/posts/images/cs101_class2_summary/12.png)
用于证明某谓词 $P(s)$ 对全体该数据类型的对象成立：
1. **确定归纳假设：** 设定命题 $P(s)$ 为
2. **证明基础情况：** 证明当 $s$ 处于 Base Case 时，$P(s)$ 成立。
    * *推导过程：* ![课件整理](/posts/images/cs101_class2_summary/17.png)
3. **证明构造情况：** 证明在 $P(r)$ 成立的前提下，经过构造器操作后的 $P('u' + r)$ 依然成立。
    * *推导过程：* ![课件整理](/posts/images/cs101_class2_summary/18.png)

**📝 经典案例复盘：** 证明字符串拼接满足 $len(s+t) = len(s) + len(t)$
详细学习笔记，请移步[黄世鑫做的详细报告](/posts/images/cs101_class2_summary/hsx.pdf)

### 3.4 结构归纳法计算机智慧的总结
![课件问题引入](/posts/images/cs101_class2_summary/13.png)

---

## ⏱️ 模块四：性能评估把关：递推式与主方法 (Recurrence & Master Method)
详细学习笔记，请移步[作者的blog](https://kklullaby.github.io/posts/master_theorem/)
![课件问题引入](/posts/images/cs101_class2_summary/15.png)
### 4.1 递推式的两大阵营

![课件问题引入](/posts/images/cs101_class2_summary/14.png)

线性递推的代码示例，各位可以在python tutor 里面自行跑通并查看示例：
``` python
def hanoi(n, src, aux, dest):
    if n == 1:
        print(f"{src} -> {dest}")
    else:
        hanoi(n-1, src, dest, aux)
        hanoi(1, src, aux, dest)
        hanoi(n-1, aux, src, dest)

# 示例调用：移动3个圆盘
hanoi(3, 'A', 'B', 'C')
```

``` python
def fibonacci(n): # fib-100.py
    if (n == 0 or n == 1):
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 打印前 40 个斐波那契数
for i in range(40):
    print(f"F({i}) = {fibonacci(i)}")
```

* **线性递推式 (Linear Recurrence)：**
    * *特征：* [记录特征，如 $T(n) = aT(n-1) + \dots$]
    * *经典问题：* 汉诺塔、斐波那契数列。
    * *复杂度警告：* 通常导致极度耗时的指数级复杂度。
* **分治递推式 (Divide-and-Conquer Recurrence)：**
    * *特征：* 将规模为 $n$ 的问题划分为子问题求解再合并。

### 4.2 主方法 (Master Method) 核心法则

![课件问题引入](/posts/images/cs101_class2_summary/16.png)

## 💡 个人 Action Items (待办与思考)
- [ ] 验证：在终端手写一个容易引发指数级复杂度的线性递推代码，并记录运行耗时。
- [ ] 推导：不看课件，白板推导一次归并排序的主方法求解过程。
- [ ] 推导：手动推导字符拼接的结合律，完成小班课作业。