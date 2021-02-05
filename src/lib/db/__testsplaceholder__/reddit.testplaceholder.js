/* eslint-disable  */

const mock = {
  kind: "Listing",
  data: {
    modhash: "",
    dist: 25,
    children: [
      {
        kind: "t3",
        data: {
          is_self: false,
          stickied: false,
          permalink: "/r/dogs/comments/i9c75h/…_to_trade_me_for_a_fry/",
          title: "Meet my grandma's pupper…d Ava! (mini schnauzer)",
          is_reddit_media_domain: false,
          url: "https://www.reddit.com/gallery/i95c08",
          media: {
            type: "redgifs.com",
            oembed: {
              html:
                '&lt;iframe src="https://redgifs.com/ifr/thankfulelegantbudgie" frameborder="0" scrolling="no" width="100%" height="100%"\n      allowfullscreen style="position:absolute;"&gt;&lt;/iframe&gt;',
            },
          },
        },
      },
    ],
    after: "t3_i5u06w",
  },
};

// I should be able to:
//
// CHECK IF reddit media domain
// IF TRUE, USE the URL
// IF FALSE, USE OEMBED HTML
// HTML DECODE the OEMBED HTML
// EXTRACT the src=""
