const fetchGfycat = require("../fetchGfycat");

describe("gfycat fetch tests", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("call gfycat api and return a valid url", async () => {
    const url = "https://api.gfycat.com/v1/gfycats/hairyseveralherald";

    const res = {
      gfyItem: {
        webmUrl: url,
      },
    };

    fetch.mockResponseOnce(JSON.stringify(res));

    await fetchGfycat("https://gfycat.com/hairyseveralherald").then(res => {
      expect(res).toEqual(url);
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(url);
  });
});
