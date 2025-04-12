const  dotts = '...';
function showPage(page){
  // 1 prepage, 2 showpage, 3 nextpage
    getData(page);
    const totaPages = parseInt(document.querySelector('#total-pages').value);
    const pageNum = parseInt(page);
    htmlPagination(pageNum, totaPages);
}
function htmlPagination(currentPage, totalPages){
  console.log('crr:',currentPage,totalPages);
  const dataPage = usePagination(totalPages, currentPage);
  let prePage = '';
  let nextPage = '';
  const preBtn = document.querySelector('#prebtn');
  const nextBtn = document.querySelector('#nextbtn');
  if(currentPage > 1){
    preBtn.classList.remove('disabled');
    preBtn.onclick= function() {showPage(currentPage - 1, totalPages)}
  } else {
    preBtn.classList.add('disabled');
  }
  if(currentPage < totalPages){
    nextBtn.classList.remove('disabled');
    nextBtn.onclick= function() {showPage(currentPage + 1, totalPages)}
  } else {
    nextBtn.classList.add('disabled');
  }
  let listPageHtml = '';
  dataPage.map((pageNumber, i) => {
    if(pageNumber === dotts){
      listPageHtml += `<li class="dots">...</li>`;
    } else {
      if(currentPage == 1 && pageNumber == 1){
        listPageHtml += `<li class="${pageNumber === currentPage ? 'active' : ''}">${pageNumber}</li>`;
 } else {
        listPageHtml += `<li class="${pageNumber === currentPage ? 'active' : ''}" onclick="showPage(${pageNumber})">${pageNumber}</li>`;
      }
    }
  })
  document.querySelector('.number-buttons').innerHTML = listPageHtml;
}
function showData(list, page){
  let totalHtml = '';
  let x = 1;
  list.map((item, i) => {
    let classItem = 'is-normal';
    if(page == 1){
        const big = [5,10,19,26,39,46,60,62,74,78];
        
        let check = i+1;
        if(item.status == 25){
            check = i - 102*x + 1;
            if(check > 102){
                x= x+1;
            }
        }
        if(big.includes(check)){
          classItem = 'is-big';
        }
    }
    const logo = item.logoLink;
    let html = '';
    let slug = `/more-game/${item.slug}.html`;
    if(item.statusDup == 1 || item.status == 25){
        slug = `/detail/${item.slug}.html`;
    }
    if(item.slug == 'eggy-car'){
        slug = '/play.html';
    }
    if(page == 1){
    html = `<a class="game-icon-a group bg-gray-200 relative hover:scale-110 ${classItem}" href="${slug}">
              <img alt="${item.title}" src="${logo}" class="game-icon-img bg-green-100 font-xs" loading="eager" style="color:transparent;background-color:#EB181B;">
              <span class="game-icon-h3">${item.title}</span>
              
            </a>`;
    } else {
    
    html = `<article>
                <div class="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 block rounded-[1.25rem] border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                  <figure class="relative">
                    <a title="${item.title}" href="${slug}" style="cursor:pointer">
                      <img src="${logo}" alt="${item.title}" class="w-full rounded-[0.625rem]" loading="lazy" style="height:170px">
                    </a>
                  </figure>
                  <div class="mt-7 flex items-center justify-between">
                    <a title="${item.title}" href="${slug}" style="cursor:pointer">
                      <span class="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">${item.title}</span>
                    </a>
                  </div>
            
                </div>
            </article>`
    }
    totalHtml += html;
  })
  if(page > 1){
    document.querySelector('#game-content').className = 'grid grid-cols-1 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-5';
  } else {
    document.querySelector('#game-content').className = 'p-4 grid-container gap-4 grid-flow-row-dense';
  }
  document.querySelector('#game-content').innerHTML = totalHtml;
}
const getPages = function(length, inc = 1){
  return Array.from({ length: length }, (v, i) => (i + inc))
}
function usePagination(
  totalPages,
  currentPage
) {
  // console.log(totalPages);
  // -> 1 2 3 4 5
  if (totalPages <= 5) {
    return getPages(totalPages)
  }
  // -> 1 2 3 4 ... 10
  if (currentPage <= 3) {
    return [1, 2, 3, 4, dotts, totalPages]
  }
  // -> 1 ... 4 5 6 ... 10
  if (currentPage < totalPages - 2) {
    return [
      1,
      dotts,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      dotts,
      totalPages,
    ]
  }
  // -> 1 ... 7 8 9 10
  return [1, dotts, ...getPages(4, totalPages - 3)]
}
function getData(page){
  let perPage =  60;
  if(page == 1){
    perPage = 102 + 192;
  }
  const url = `/data-json/page-${page}.json`;
  const res = fetch(url).then(response => response.json())
.then(data => {
  const repo = data;
    if(repo.status == true){
        const response = {data: repo.data, currentPage: page, totalPages: repo.totalPage};
        showData(repo.data, page);
    } else {
        const response = {status: false, data: [], currentPage: -1, totalPages: -1}
    }
  });
  
}
let listGame;
let t = Date.now();
fetch(`/data-json/search.json?v=${t}`).then((res) => res.json()).then((data) => listGame = data);
function loadGA(){
    if(window.location.host == 'leveldevil.net'){
        var  r = document.createElement("script");
      r.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=GT-KD29WPM3"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'GT-KD29WPM3', {
                'cookie_flags': 'SameSite=None;Secure'
              });
        },document.head.appendChild(r);
    }
}
window.addEventListener('load', function() {
    loadGA();
});
document.querySelector('#inputPC').addEventListener("input", function() {
      var x = document.querySelector('#inputPC').value;
      var html = "";
      console.log("--fx--",x);
      document.querySelector('.pagination-pagination').style.display = "none";
      let dataGame = [];
      if(x != ""){
        listGame.map((item, i) => {
            if (item.title.toUpperCase().indexOf(x.toUpperCase()) >= 0){
                dataGame.push(item);
            }
        })
      } else {       
        showPage(1);
        document.querySelector('.pagination-pagination').style.display = "";
      } 
      if(dataGame.length > 0){
        showData(dataGame, 2);
      }
});