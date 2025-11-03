// get intellisense to handle scss modules 
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}