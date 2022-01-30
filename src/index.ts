// minecraft !

// ok so we will have a world; but it will be generated with math.noise
// the world will consist of Block's, world will be split into 10x1 chunks

class Block {
	public x: number;
	public y: number;
	public z: number;
	private block: BasePart;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		let block = new Instance("SpawnLocation");
		let mesh = new Instance("SpecialMesh");
		mesh.MeshId = "rbxassetid://";
		mesh.TextureId = "rbxassetid://";
		mesh.MeshType = Enum.MeshType.FileMesh;
		block.Enabled = false;
		block.Material = Enum.Material.Fabric;
		block.Anchored = true;
		block.Size = new Vector3(3, 3, 3);
		block.Position = new Vector3(x, y, z);
		block.Locked = true;
		block.CanTouch = false;
		block.CanQuery = false;
		block.Parent = script;
		this.block = block;
	}
	destroy() {
		this.block.Destroy();
	}
}

let chunks = [];

for (let x = 0; x < 10; x++) {
	let chunk = [];
	for (let z = 0; z < 11; z++) {
		chunk.push(new Block(x * 3, 1.5, z * 3));
	}
	chunks.push(chunk);
}

export {};
