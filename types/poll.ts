export default interface Poll {
  name: string;
  id: string;
  open: boolean;
  owner: string;
  prompt: string;
  options: string[];
  inputs: {
    id: string;
    input: number;
  }[];
}
