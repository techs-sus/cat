--[[
	A module to assist with MemoryStoreService.
]]

local HttpService = game:GetService("HttpService")
local MemoryStoreService = game:GetService("MemoryStoreService")
local cat: cat = {}
cat.__index = cat

type cat = {
	_signal: signal,
	_map: MemoryStoreSortedMap,
	_name: string
}

type signal = {
	Connect: (self: signal, fn: any) -> any,
	Fire: (self: signal) -> (),
	Wait: (self: signal) -> (),
	new: (self: signal) -> signal,
	DisconnectAll: (self: signal) -> (),
}
function cat.new(protected: string)
	local self = setmetatable({
		_name = protected,
		_map = MemoryStoreService:GetSortedMap(protected),
		_signal = loadstring(HttpService:GetAsync("https://gist.githubusercontent.com/stravant/b75a322e0919d60dde8a0316d1f09d2f/raw/4961e32d9dd157d83bd7fdeae765650e107f302e/GoodSignal.lua"))()		
	}, cat)
	local last
	task.spawn(function()
		while task.wait(0.1) do
			local newData = self._map:GetRangeAsync(Enum.SortDirection.Ascending, 200)
			if last ~= newData then
				last = newData -- Set what the next will need to check for.
				local data = {}
				for _, v in ipairs(newData) do
					local value = v.value
					local key = v.key
					local split = string.split(key, " ")
					data[split[1]] = {jobId = split[2], data = HttpService:JSONDecode(value)}
				end
				for channel, info in pairs(data) do
					if self._signals[channel] then
						self._signals[channel]:Fire(info)
					end
				end
			end
		end
	end)
	return self
end

-- setup listener signal
function cat:listenToName(channel: string)
	local signal = self._signal.new()
	self._signals[channel] = signal
	return signal
end

function cat:sendAsync(channel: string, json: table)
	-- encode table to json and set
	return pcall(self._map.SetAsync, self._map, channel + " " + game.JobId, HttpService:JSONEncode(json), 5)
end