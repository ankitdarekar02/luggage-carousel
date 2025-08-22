# Luggage Carousel

This project is a small interactive simulation of an airport luggage carousel, built with **React**, **TypeScript**, and **Vite**.  
It includes a moving conveyor belt with bags that can be dragged into storage slots, a priority row with special handling rules, and the ability to unload or clear luggage with animations.

---

## ✨ Features

- **Moving conveyor belt** – bags move infinitely from left to right.
- **Drag & drop** – built with [dnd-kit](https://github.com/clauderic/dnd-kit), so it works on both desktop and mobile devices.
- **Storage rows**  
  - 3 rows in total (3 columns each).  
  - The first row is the **priority row** (highlighted with dotted borders).  
- **Unloading logic**  
  - Bags in the priority row are always unloaded first.  
  - If no priority bags remain, unloading follows **Last-In-First-Out (LIFO)** order.  
- **Clear vs Reset**  
  - **Clear**: smoothly unloads all bags into the Unloaded section.  
  - **Reset**: restores everything to the initial state.  
- **Animations** – smooth fade and movement effects when unloading or clearing.  
- **Test suite** – basic UI test for drag & drop, plus reducer logic tests.

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm (or yarn/pnpm, if you prefer)

### Install dependencies
```bash
npm install


### Run
```bash
npm run dev
```

### Test
```bash
npm run test
```
