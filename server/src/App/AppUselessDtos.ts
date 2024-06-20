import { 
    DUIFormRow,
    DUISection,
    PBCanvas, 
    PBImage, 
    RawData
} from "@paperback/types";

export class AppPBCanvas implements PBCanvas {
    readonly width: number = 0;
    readonly height: number = 0;
    readonly data?: RawData;

    setSize(width: number, height: number): void {}
    drawImage(pbImage: PBImage, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number): void {}
    encode(format: string): RawData|undefined { return undefined }
}

export class AppPBImage implements PBImage {
    readonly width: number = 0;
    readonly height: number = 0;
    readonly data?: RawData;
}

export class AppRowData implements RawData {
    readonly length: number = 0;
    [index: number]: Byte;
    toString(): string {
        return '';
    }
}

export const UselessAppFunction = 
{
    createDUIBinding: () => ({ 
        get: async (): Promise<any> => {}, 
        set: async(newValue: any): Promise<void> => {}} ),
    createDUIForm: () => ({ 
        onSubmit: (values: Record<any, any>): Promise<void> | undefined => { return undefined }, 
        sections: async (): Promise<DUISection[]> => [] 
    }),
    createDUISection: () => ({
        _rows: async (): Promise<DUIFormRow[]> => []
    }),
    createDUISelect: () => ({ 
        id: 'id',
        labelResolver: async (arg0: string): Promise<string> => 'label'
    }),
    createDUIStepper: () => ({ id: 'id'}),
    createDUISwitch: () => ({ id: 'id'}),
    createDUIButton: () => ({ id: 'id'}),
    createDUIHeader: () => ({ id: 'id'}),
    createDUIInputField: () => ({ id: 'id'}),
    createDUILabel: () => ({ id: 'id'}),
    createDUILink: () => ({ id: 'id'}),
    createDUIMultilineLabel: () => ({ id: 'id'}),
    createDUINavigationButton: () => ({ id: 'id'}),
    createDUIOAuthButton: () => ({ id: 'id'}),
    createDUISecureInputField: () => ({ id: 'id'}),
    createSection: () => ({
        _rows: async (): Promise<DUIFormRow[]> => []
    }),
    createButton: () => ({ id: 'id'}),
    createHeader: () => ({ id: 'id'}),
    createInputField: () => ({ id: 'id'}),
    createLabel: () => ({ id: 'id'}),
    createLink: () => ({ id: 'id'}),
    createMultilineLabel: () => ({ id: 'id'}),
    createNavigationButton: () => ({ id: 'id'}),
    createOAuthButton: () => ({ id: 'id'}),
    createSecureInputField: () => ({ id: 'id'}),
    createStepper: () => ({ id: 'id'}),
    createSwitch: () => ({ id: 'id'}),
    createSelect: () => ({ 
        id: 'id',
        labelResolver: async (arg0: string): Promise<string> => 'label'
    }),
    createByteArray: () => new Uint8Array(),
    createRawData: () => new AppRowData(),
    createPBCanvas: () => new AppPBCanvas(),
    createPBImage: () => new AppPBImage(),
}