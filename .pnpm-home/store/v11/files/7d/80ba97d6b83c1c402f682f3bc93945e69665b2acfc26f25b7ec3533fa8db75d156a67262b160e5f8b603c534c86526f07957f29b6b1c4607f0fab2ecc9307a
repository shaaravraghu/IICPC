import { Plugin } from 'vite';

var version = "0.5.5";

interface RelatedElements {
    children: Array<BaseElement>;
    parent: BaseElement | null;
}
interface ElementMetadata extends BaseElement {
    elementPath: string;
    elementName: string;
    originalTextContent?: string;
    screenshotBlob?: Blob;
    srcAttribute?: string;
    siblingCount?: number;
    hasChildElements?: boolean;
    computedStyles: {
        backgroundColor: string;
        borderTopColor: string;
        borderRightColor: string;
        borderBottomColor: string;
        borderLeftColor: string;
        borderTopLeftRadius: string;
        borderTopRightRadius: string;
        borderBottomRightRadius: string;
        borderBottomLeftRadius: string;
        borderTopWidth: string;
        borderRightWidth: string;
        borderBottomWidth: string;
        borderLeftWidth: string;
        color: string;
        display: string;
        position: string;
        width: string;
        height: string;
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        margin: string;
        padding: string;
        opacity: string;
        textAlign: string;
    };
    relatedElements: RelatedElements & {
        /** @deprecated */
        nextSibling?: BaseElement;
        /** @deprecated */
        grandParent?: BaseElement;
    };
}
interface BaseElement {
    tagName: string;
    className?: string;
    textContent: string;
    id?: string;
    nodeId?: number;
    relatedElements: RelatedElements;
}
interface SerializedRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
type Message = {
    type: 'TOGGLE_REPLIT_VISUAL_EDITOR';
    timestamp: number;
    enabled: boolean;
    enableEditing?: boolean;
    /** When true the beacon suppresses its own overlays and instead emits
     *  `ELEMENT_HOVERED` messages with element geometry on every mousemove. */
    hoverMessages?: boolean;
} | {
    type: 'REPLIT_VISUAL_EDITOR_ENABLED';
    timestamp: number;
    /** Echoed from the toggle request so the parent can distinguish
     *  headless hit-testing activation from full visual-edit activation. */
    hoverMessages?: boolean;
} | {
    type: 'REPLIT_VISUAL_EDITOR_DISABLED';
    timestamp: number;
} | {
    type: 'ELEMENT_SELECTED';
    payload: ElementMetadata;
    timestamp: number;
    /** Present when the beacon was activated with `hoverMessages: true`. */
    elementBounds?: SerializedRect;
} | {
    type: 'ELEMENT_UNSELECTED';
    timestamp: number;
} | {
    type: 'ELEMENT_HOVERED';
    timestamp: number;
    /** `null` when the mouse has left the iframe (hover cleared). */
    elementBounds: SerializedRect | null;
    elementName: string;
} | {
    type: 'ELEMENT_TEXT_CHANGED';
    payload: ElementMetadata;
    timestamp: number;
} | {
    type: 'SELECTOR_SCRIPT_LOADED';
    timestamp: number;
    version: string;
} | {
    type: 'CLEAR_SELECTION';
    timestamp: number;
} | {
    type: 'UPDATE_SELECTED_ELEMENT';
    timestamp: number;
    attributes: {
        style?: string;
        textContent?: string;
        className?: string;
        src?: string;
    };
} | {
    type: 'CLEAR_ELEMENT_DIRTY';
    timestamp: number;
} | {
    type: 'APPLY_THEME_PREVIEW';
    timestamp: number;
    themeContent: string;
} | {
    type: 'CLEAR_THEME_PREVIEW';
    timestamp: number;
} | {
    type: 'LIGHT_MODE_USED';
    timestamp: number;
} | {
    type: 'DARK_MODE_USED';
    timestamp: number;
} | {
    type: 'SCREENSHOT_PAGE';
    timestamp: number;
    /** Opaque caller-provided ID echoed back in the result so the requester
     *  can correlate the response when multiple screenshots are in-flight. */
    requestId: string;
} | {
    type: 'SCREENSHOT_PAGE_RESULT';
    timestamp: number;
    requestId: string;
    screenshotBlob?: Blob;
    error?: string;
} | {
    type: 'PINCH_WHEEL';
    timestamp: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'DRAG_START';
    timestamp: number;
    pointerId: number;
    button: number;
    pressure: number;
    isPen: boolean;
    clientX: number;
    clientY: number;
    startClientX: number;
    startClientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'DRAG_MOVE';
    timestamp: number;
    pointerId: number;
    movementX: number;
    movementY: number;
    pressure: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'DRAG_END';
    timestamp: number;
    pointerId: number;
    button: number;
    clientX: number;
    clientY: number;
    pressure: number;
    isPen: boolean;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'SCROLL_BOUNDARY';
    timestamp: number;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'RELAY_TO_IFRAME';
    timestamp: number;
    event: RelayedEventToIframe;
};
type RelayedEventToIframe = {
    kind: 'cancel-interaction';
} | {
    kind: 'set-canvas-gesture-relay';
    enabled: boolean;
};

interface CartographerOptions {
    /** Override the root directory for metadata path resolution (absolute or relative to Vite root) */
    root?: string;
}
declare function cartographer(options?: CartographerOptions): Plugin;

export { type BaseElement, type CartographerOptions, type ElementMetadata, type Message, type SerializedRect, cartographer, version };
