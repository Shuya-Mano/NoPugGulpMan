// $(function () {
//   $(".top-fv__catch").vegas({
//     slides: [
//       { src: "./asset/img/top-fv.jpg" },
//       { src: "./asset/img/top-fv02.jpg" },
//       { src: "./asset/img/top-fv03.jpg" },
//     ],
//     timer: "false",
//     animation: "kenburns",
//     animationDuration: "10000",
//   });
// });

// $(function () {
//   $(".multiple-items").slick({
//     dots: true, // ドットインジケーターの表示
//     infinite: true, // スライドのループを有効にするか
//     slidesToShow: 3, // 表示するスライド数を設定
//     slidesToScroll: 1, // スクロールするスライド数を設定
//     dotsClass: "slide-dots",
//     prevArrow: '<button class="slide-arrow prev-arrow"></button>',
//     nextArrow: '<button class="slide-arrow next-arrow"></button>',
//   });
// });

$(function () {
  $(".multiple-items").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true, // 左右の次へ、前へボタンを表示する
    draggable: true, // ドラッグ可能
    prevArrow: '<div class="custom-prev-arrow"></div>',
    nextArrow: '<div class="custom-next-arrow"></div>',

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
