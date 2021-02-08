# Fap Instructor

![Release](https://github.com/fapinstructor/fapinstructor-api/workflows/Release/badge.svg)

The api that supports the fapinstructor client.

## Setup

1. Configure your `.env` file under server. Use `.env.example` as a reference
2. Start the docker containers `make start`. This will build and start the docker container with an attached log watcher.
3. Application is ready for HTTP requests `localhost:3000/`

## Debugging

When running the above steps, a debugger endpoint is automatically created. A debugger task has already been created for **VSCode**. After the server has started simply press **F5** and any breakpoints you add will be hit.

To examine the output of the server, you can run the command `make logs`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
