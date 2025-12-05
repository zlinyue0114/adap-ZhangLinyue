import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public override findNodes(bn: string): Set<Node> {
        const result = super.findNodes(bn);

        for (const child of this.childNodes) {
            const sub = child.findNodes(bn);
            for (const item of sub) {
                result.add(item);
            }
        }

        return result;
    }

}