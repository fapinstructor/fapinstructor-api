const { validSubreddit, stripQueryString } = require("../regex");

describe("regex", () => {
  describe("strip query string from url", () => {
    it("url without querystring", () => {
      const input = "https://test.example.com";
      const expected = "https://test.example.com";
      const actual = stripQueryString(input);

      expect(actual).toBe(expected);
    });

    it("url with querystring", () => {
      const input = "https://test.example.com?a=1&a=2";
      const expected = "https://test.example.com";
      const actual = stripQueryString(input);

      expect(actual).toBe(expected);
    });

    it("when not a url it should return the passed in value", () => {
      const input = "cat";
      const expected = "cat";
      const actual = stripQueryString(input);

      expect(actual).toBe(expected);
    });

    it("url with HLS video shouldn't strip extension", () => {
      const input = "https://test.example.com/twpxtz/HLSPlaylist.m3u8?a=123";
      const expected = "https://test.example.com/twpxtz/HLSPlaylist.m3u8";
      const actual = stripQueryString(input);

      expect(actual).toBe(expected);
    });
  });

  describe("subreddit validation", () => {
    it("subreddit that starts with a number should be valid", () => {
      expect(validSubreddit.test("60abcdef")).toBe(true);
    });

    it("subreddit with word should be valid", () => {
      expect(validSubreddit.test("technology")).toBe(true);
    });

    it("subreddit with underscore should be valid", () => {
      expect(validSubreddit.test("instant_regret")).toBe(true);
    });

    it("subreddit with number should be valid", () => {
      expect(validSubreddit.test("PS4")).toBe(true);
    });

    it("subreddit that starts with an underscore should be invalid", () => {
      expect(validSubreddit.test("_invalid")).toBe(false);
    });

    it("subreddit with spaces should be invalid", () => {
      expect(validSubreddit.test("!invalid")).toBe(false);
    });

    it("subreddit with three letters should be valid", () => {
      expect(validSubreddit.test("abc")).toBe(true);
    });

    it("subreddit with less than three letters should be invalid", () => {
      expect(validSubreddit.test("ab")).toBe(false);
    });

    it("subreddit with twenty-one letters should be valid", () => {
      expect(validSubreddit.test("abcdefghijklmnopqrstu")).toBe(true);
    });

    it("subreddit with greater than twenty-one letters should be invalid", () => {
      expect(validSubreddit.test("abcdefghijklmnopqrstuv")).toBe(false);
    });
  });
});
