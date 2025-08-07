# Howdy, friends!
Time flies, technologies growings up, and appearings new methods to do something. And mods too have that.
Go learn, why is components and why it can replace default objects to describe elements.

This library will work only with TypeScript compiler, because keep it in your mind.

## Components
Components - it's a functions, which returns xml code. After compilation xml code will replace to call of functions. It's syntax sugar and attempt to short code of a part.

## Syntax features

Values of attributes in default inputs only strings, because we often usings default objects.

Numbers, for example: 
```tsx
<x={10} y={10}>
```

Objects:
```tsx
<font={{ size: 30 }}>
```  

In case, when components inputs nothing, his can be shorten:
```tsx
<Component/>
```

## Various
We have to different various

### Fixed:
Key takes from tag.

Go write component:
```tsx
const Cat = () => (
    <picture type="image" x={0} y={0}>example/cat</picture>
);
```
In result we got same object:
```js
{
    picture: {
        type: "image",
        bitmap: "example/cat",
        x: 0,
        y: 0
    }
}
```
### Free
This components can have not key and in one time presents data, but can use `element` tag.

Go write component:
```ts
const Meow = () => (
    return <element type="text">Meow!</element>
);
```
Go learn data:
```js
{
    type: "text",
    text: "Meow!"
}
```
Then go reach first component result:
```tsx
const Meow = () => (
    return <element type="text" key="meow">Meow!</element>
);
```
Result:
```tsx
{
    meow: {
        type: "text",
        text: "Meow!"
    }
}
```
## Moving data to components:
Components can take data from any places, and from value (child).

Go create same:
```tsx
const Title = (properties, child) => {
    return <element type="text" font={{color: 0.375, size: 30 }} key={properties.key}>{ child }</element>
}
```
Put data:
```js
const title = Title({
    key: "title"
}, "Hi, component!");
```
Go learn result:
```js
{
    title: {
        type: "text",
        font: { color: 0.375, size: 30 },
        text: "Hi, component!"
    }
}
```
## Placing components
One of most important and interesting thing :)

Use component can you form groups of component and provide to your UI in one time. 

Go create row of components to consider:
```tsx
const Author = (properties, child) => (
    <author type="text" font={{ color: android.graphics.Color.BLACK, size: 15 }} x={200} y={50}>Author: { child }</author>
);

const Tools = (properties, child) => (
    <tools type="text" font={{ size: 10 }} x={200} y={60}>Tools: { properties.tools.toString() }</tools>
);

const Mod = (properties, child) => (
    <mod type="text" font={{ size: 10 }} x={200} y={75}>Mod: { child }</mod>
);
```
Then go create window and component, shows name of author, tools and name of mod.
```tsx
const window = new UI.Window();
const Project = () => (
    <> 
        <Author>ArtemKot</Author>
        <Tools tools={["EnergyNet", "ChargeItem", "SoundLib"]}></Tools>
        <Mod>Galacticraft 4</Mod>
    </>
);
window.setContent({
    elements: Project()
});
```

## Activation
1. Find in this folder file **settings.json**, contains settings for compiler of TypeScript;
2. Paste values inside your tsconfig, if you use toolchain from Nernar, paste field **tsconfig** with values from file settings.json in file make.json;
3. Add file **Component.tsx** or **Component.js** in your project and connect to **.includes** or **tsconfig.json**;
4. Rename type of files, when you will use components, in **tsx**;
5. Start task of rebuild declarations or rebuild by yourself;
## Ending
If it was interesting, try it! Thank you for reading this documentation, good luck in your beginnings. 