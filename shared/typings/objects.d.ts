type ValueOf<T> = T[keyof T];
type NoPayLoad = {};

// Define interfaces that are shared between Panorama and vScripts here.

interface IEventData {
    message: string;
}