// eslint-disable-next-line @typescript-eslint/no-namespace


    //variable data type,include int,float,string,boolean
    export const VariableDataType = {
        String: 'String',
        Short: 'Short',
        Int: 'Int',
        Long: 'Long',
        Float: 'Float',
        Double: 'Double',
        Boolean: 'Boolean',
        Byte: 'Byte',
        Char: 'Char',
    } as const;
    
    export type VariableDataType = typeof VariableDataType[keyof typeof VariableDataType];

 
