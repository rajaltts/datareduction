
export type Selection = {
 label: string;
  name: string;
};

export type Parameter = {
    label: string;
    name: string;
    selection?: Selection[];
    value: string;
   };
   
   export type Method = {
    label: string;
    type: string;
    params: Parameter[];
   };
   
   export type Operation = {
    action: string;
    action_label: string;
    methods: Method[];
    selected_method: string;
    status: string;
    error: string;
   };