const fetchImgur = require("../fetchImgur");

describe("imgur tests", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("fetch gallery", async () => {
    const res = {
      data: {
        images: [{ link: "http://link.png" }],
      },
    };

    fetch.mockResponseOnce(JSON.stringify(res));

    await fetchImgur("http://imgur.com/gallery/GIJevBA").then(res => {
      expect(res).toEqual(["http://link.png"]);
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://api.imgur.com/3/gallery/album/GIJevBA",
    );
  });

  it("fetch album", async () => {
    const res = {
      data: [{ link: "http://link.png" }],
    };

    fetch.mockResponseOnce(JSON.stringify(res));

    await fetchImgur("https://imgur.com/a/x9F6yoR").then(res => {
      expect(res).toEqual(["http://link.png"]);
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://api.imgur.com/3/album/x9F6yoR/images",
    );
  });

  it("fetch reddit gallery", async () => {
    const res = {
      data: { link: "http://link.png" },
    };

    fetch.mockResponseOnce(JSON.stringify(res));

    await fetchImgur("https://m.imgur.com/r/IDmydog/NkxaCCt").then(res => {
      expect(res).toEqual(["http://link.png"]);
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://api.imgur.com/3/gallery/r/IDmydog/NkxaCCt",
    );
  });

  it("fetch direct image", async () => {
    await fetchImgur("https://i.imgur.com/r0m14lb.gif").then(res => {
      expect(res).toEqual(["https://i.imgur.com/r0m14lb.gif"]);
    });
  });

  it("fetch everything else", async () => {
    const res = {
      data: { link: "http://link.png" },
    };

    fetch.mockResponseOnce(JSON.stringify(res));

    await fetchImgur("https://imgur.com/kWuohXW").then(res => {
      expect(res).toEqual(["http://link.png"]);
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://api.imgur.com/3/image/kWuohXW",
    );
  });
});
