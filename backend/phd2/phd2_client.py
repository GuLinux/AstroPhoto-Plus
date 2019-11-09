import asyncio
import sys
import json

async def stream_as_generator(loop, stream):
    reader = asyncio.StreamReader(loop=loop)
    reader_protocol = asyncio.StreamReaderProtocol(reader)
    await loop.connect_read_pipe(lambda: reader_protocol, stream)

    while True:
        line = await reader.readline()
        if not line:  # EOF.
            break
        yield line



async def write(writer):
    id = 0
    loop = asyncio.get_event_loop()
    async for line in stream_as_generator(loop, sys.stdin):
        id += 1
        line = line.decode().strip().split(',')
        method = json.dumps({ 'method': line[0], 'params': line[1:], 'id': id })
        print(' >>>: {}'.format(method))
        writer.write((method + '\r\n').encode())




async def read(reader):
    while True:
        data = await reader.readline()
        if not data:
            raise RuntimeError('Socket not connected')
        print(' <<<: {}'.format(data.decode().strip()))

async def main():
    stdin_queue = asyncio.Queue()
    reader, writer = await asyncio.open_connection('127.0.0.1', 4400)

    read_task = asyncio.create_task(read(reader))
    write_task = asyncio.create_task(write(writer))

    await asyncio.gather(*[read_task, write_task])

asyncio.run(main())
