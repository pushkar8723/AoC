Advent of Code 2019
===================

I recently came to know about [Advent of Code](https://adventofcode.com/) and thougth
should try it out. These are my solution for various problems provided.

### How to run this?
Programs are sorted by day. So, to execute for 5th day's input go to folder `5`.
Download the input in a file and pipe the input.

For example, your input is saved in `input.txt`. Run following command in terminal.

```
node 1.js < input.txt
```

There is another way to eaisily run these programs (but it requires you to trust me :p).
Run following commands to set up
```
npm i
npm run cli init
```

It will ask you for the year (enter 2019), and your cookie (This is where you need to trust me).
You can get your cookie from browser console.

`Open adventofcode.com > Right click > inspect > Network Tab > select first request > Headers Tab`.

Under `Request Headers` section you will find your cookie. This cookie will be used to automatically 
fetch your input when you run a program.

To run a program enter following command

```
npm run cli run <day> <program file (1.js)>
```

### What all did I learn / implemented in this exercise?

I implemented following programs:
- An intcode execution module which is used across problems.
- Tree traversal
- Common ancestor of two nodes in a tree
- Distance between two nodes in a tree
- Intersection of edges in a graph
- All permutations of a string
- BFS Graph traversal
- Calculating angle of a line from a axis
- Dealt with 0 and -0 in JavaScript
- Got introduced to Modular Arithmetic
- Implemented Game of life
- Traversed Inifinite Graph
- Traversed Unknown Graph
- Calculated slope of line
- Created visualizations for some levels
- Implemented Top Down Memorization (Dynamic Programming)
- Simulated Distributed Network
