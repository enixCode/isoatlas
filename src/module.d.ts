// Every webpack config loads svg files as asset/inline: the import is a
// data URI string, not a React component.
declare module '*.svg' {
  const content: string;
  export default content;
}
