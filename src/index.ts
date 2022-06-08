const MemoryStoreService = game.GetService("MemoryStoreService");
const HttpService = game.GetService("HttpService");
const printf = (s: string, ...s1: string[]) => print(string.format(s, ...s1));
const always = true;

class Signal {
	name: string;
	listeners: { (...a: unknown[]): void }[];
	constructor(name: string) {
		this.name = name;
		this.listeners = [];
	}
	public addListener(s: { (...a: unknown[]): void }) {
		this.listeners.push(s);
	}
	public emit(value: unknown) {
		this.listeners.forEach((listener) => listener(value));
	}
}

class Cat {
	sortedMap: MemoryStoreSortedMap;
	constructor(sortedMapName: string) {
		this.sortedMap = MemoryStoreService.GetSortedMap(sortedMapName);
	}
	public send(key: string, value: unknown) {
		this.sortedMap.SetAsync(key, value, 2); // Maybe we shouldn't use 2
	}
	public listen(key: string) {
		const signal = new Signal(key);
		task.spawn(() => {
			while (always) {
				const value = this.sortedMap.GetAsync(key);
				switch (typeOf(value)) {
					case "table":
						signal.emit(value);
						break;
					case "string":
						// It could be a json object
						try {
							signal.emit(HttpService.JSONDecode(value as unknown as string));
						} catch (e) {
							signal.emit(value);
						}
						break;
					default:
						break;
				}
				task.wait(0.05);
			}
		});
		return signal;
	}
}

export default Cat;
