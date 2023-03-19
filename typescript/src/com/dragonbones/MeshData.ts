import { BaseObject } from './BaseObject';
import { Matrix } from './Matrix';

export class MeshData extends BaseObject {

    slotPose: any;
    uvs: any[];
    vertices: any[];
    vertexIndices: any[];
    boneIndices: any[];
    weights: any[];
    boneVertices: any[];
    bones: any[];
    inverseBindPose: any[];
    skinned!: boolean;

	constructor() {
		super();

		this.slotPose = new Matrix();
        this.uvs = []; // vertices * 2
        this.vertices = []; // vertices * 2
        this.vertexIndices = []; // triangles * 3
        this.boneIndices = []; // vertices bones
        this.weights = []; // vertices bones
        this.boneVertices = []; // vertices bones * 2
        this.bones = []; // bones
        this.inverseBindPose = []; // bones
	}

	static override toString() {
        return "[class MeshData]";
    }

    override _onClear() {
        this.skinned = false;
        this.slotPose.identity();
        this.uvs.length = 0;
        this.vertices.length = 0;
        this.vertexIndices.length = 0;
        this.boneIndices.length = 0;
        this.weights.length = 0;
        this.boneVertices.length = 0;
        this.bones.length = 0;
        this.inverseBindPose.length = 0;
    }

}