declare module '*.png' {
    import { ImageSourcePropType } from 'react-native';
    const content: ImageSourcePropType;
    export default content;
}

declare module '*.app' {
    const content: any;
    export default content;
}
