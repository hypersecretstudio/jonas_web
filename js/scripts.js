// first we chack wether user is a device or a desktop
let is_device = false;
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    is_device = true;
}
console.log(is_device);

const wpcom = WPCOM();
const blog = wpcom.site('jonasgillman.wordpress.com');
const data = [];
blog.postsList({ number: 100 })
    .then(list => {
        console.log(list);
        for (const post of list.posts) {
            const content = {
                "title": post.title,
                "content": post.content,
                "excerpt": post.excerpt,
                "category": Object.keys(post.categories)[0],
                "imgs": extractImgs(post.attachments)
            }
            data.push(content);
        }
        const web_content = data.reduce((accumulator, currentValue, currentIndex, array) => {
            let parent = currentValue.category;
            let child = currentValue.title;
            if (!accumulator[parent]) {
                accumulator[parent] = {};
            }
            if (!accumulator[parent][child]) {
                accumulator[parent][child] = [];
            }
            accumulator[parent][child] = {
                text: currentValue.content,
                short: currentValue.excerpt,
                imgs: currentValue.imgs
            };
            return accumulator;
        }, {});
        console.log(web_content);
        render_web_page(web_content);
    })
    .catch(error => { console.error(error) });

function extractImgs(data) {
    const result = [];
    Object.keys(data).forEach(key => {
        result.push(data[key].URL);
    })
    // console.log(result);
    return result;
}
// let data;

// const URL = 'wp.json';
// fetch(URL)
//     .then(response => {
//         return response.json();
//     })
//     .then(json => {
//         data = json.posts;
//         // console.log(data);
//         const web_content = data.reduce((accumulator, currentValue, currentIndex, array) => {
//             let parent = currentValue.category;
//             let child = currentValue.title;
//             if (!accumulator[parent]) {
//                 accumulator[parent] = {};
//             }
//             if (!accumulator[parent][child]) {
//                 accumulator[parent][child] = [];
//             }
//             accumulator[parent][child] = {
//                 text: currentValue.content,
//                 short: currentValue.excerpt,
//                 imgs: currentValue.imgs
//             };
//             return accumulator;
//         }, {});

//         console.log(web_content);
//         render_web_page(web_content);
//     })
//     .catch(err => console.log(err))
let angle = 0;
function render_web_page(content) {

    /**
     * this gets displayed while grabbing 
     * the data
     */

    const img_sizes = {
        large: '?w=1024',
        small: '?w=300',
        thumbnail: '?w=150'
    };
    const NS = "http://www.w3.org/2000/svg";
    let index = 1;
    let id_index = 0;
    const project_container = document.getElementById('project-container');
    Object.keys(content).forEach(project => {
        // console.log(project);
        const el_id = '#project' + index; // here we define the selector for our element 
        const el = document.querySelector(el_id); // here we get the element
        const el_title = el.querySelector('.title'); // and the inner fields
        const el_list = el.querySelector('.project-list');
        // here below we set the titles
        const regex = /\_/gi;
        const project_title = project.replace(regex, ' ').toUpperCase();
        // here below we do the SVG animation
        // el_title.innerText = project_title;
        // const text_path_id = '#text-path' + index;
        // const text_path = document.querySelector(text_path_id);
        // console.log(text_path);
        // text_path.innerHTML = project_title;
        Object.keys(content[project]).forEach(title => {
            // here we do two things
            // create a div element with the content
            const content_div = document.createElement('div');
            content_div.setAttribute('class', 'content');

            // here we create the div containing the html text
            const content_text = document.createElement('div');
            content_text.setAttribute('class', 'content-text');

            const regex = /\<img[^>]*>/g;//regex to replace img tags
            const HTMLText = content[project][title].text.replace(regex, '');// here we do the replacement
            content_text.innerHTML = HTMLText;// here we insert the text
            content_div.appendChild(content_text);//append text tpo the div

            // here we create our image container with the slide show

            const img_urls = content[project][title].imgs;
            const img_id = project + '-' + title;
            if (img_urls.length > 0) {
                const content_imgs = document.createElement('div');
                content_imgs.setAttribute('class', 'content-img');
                const img = document.createElement('img');
                img.setAttribute('src', img_urls[0]);
                img.setAttribute('id', img_id)
                content_imgs.appendChild(img);
                // here we do the next button that changes the images on click
                const next_img = document.createElement('div');
                next_img.innerText = 'NEXT IMAGE ⏭';

                let img_idx = 0;
                next_img.addEventListener('click', (event) => {
                    img_idx++
                    if (img_idx >= img_urls.length) img_idx = 0;
                    img.setAttribute('src', img_urls[img_idx]);
                });
                next_img.setAttribute('class', 'next-btn');

                content_imgs.appendChild(next_img);
                content_text.insertBefore(content_imgs, content_text.firstChild);
            }


            // here we create the header of each project
            const header = document.createElement('div')
            header.setAttribute('class', 'content-header');
            const header_title = document.createElement('div');
            header_title.setAttribute('class', 'header-title');
            header_title.innerText = title;
            header.appendChild(header_title);
            // here we need to add a close button
            const header_btns = document.createElement('div');
            header_btns.setAttribute('class', 'content-buttons');
            // if device we make only close button
            const close_btn = document.createElement('div');
            close_btn.setAttribute('class', 'close-button');
            close_btn.onclick = () => $(content_div).toggle('fast');
            header_btns.appendChild(close_btn);

            header.insertBefore(header_btns, header.firstChild);//insert buttons

            content_div.insertBefore(header, content_div.firstChild);//insert header
            const id_name = 'content' + id_index;
            content_div.setAttribute('id', id_name);
            if (window.innerWidth < 900) {

            } else {
                const left = Math.floor(Math.random() * (innerWidth * 0.4));//correct this!
                const top = Math.floor(Math.random() * (innerHeight * 0.3));
                content_div.style.top = left + 'px';
                content_div.style.left = top + 'px';
                content_div.style.width = innerWidth * 0.5 + 'px';
                content_div.style.height = innerHeight * 0.5 + 'px';
            }
            project_container.appendChild(content_div);//insert in the project container
            $(content_div).draggable();//make the divs draggable
            $(content_div).resizable();//make the divs resizable

            // we need to append all the
            // titles of the the project as a list
            const list_element = document.createElement('div');
            list_element.innerText = title;
            list_element.onclick = (event) => {
                // when you click the list element
                // it shows hides the content of the project
                $(content_div).toggle('fast');
            }
            el_list.appendChild(list_element);
            // console.log(project, title);
            id_index++;
        });
        index++;
    });
    /**
     * this will be displayed after the data is rendered
     * in the webpage
     */


}

if (!is_device) {
    // head animation
    setInterval(() => {
        // console.log(position);
        const headImg = document.querySelector('.idle-container img');
        const rotation = 'transform: rotate(' + angle + 'deg);';
        headImg.setAttribute('style', rotation);
        angle = (angle + 3) % 360;
    }, 50);

    window.onmousemove = (event) => {
        let x = event.clientX + 10;
        let y = event.clientY + 10;

        const head_div = document.querySelector('.idle-container');

        const bbox = head_div.getBoundingClientRect();
        if (x > innerWidth / 2) x -= bbox.width + 10;
        if (y > innerHeight / 2) y -= bbox.height + 10;

        const position = 'top: ' + y + 'px; left: ' + x + 'px;';
        head_div.setAttribute('style', position);

    }


    $('.function-buttons').hover((el) => {
        const head_div = document.querySelector('img#idle');
        head_div.setAttribute('id', 'idle-show')
    }, (el) => {
        const head_div = document.querySelector('img#idle-show');
        head_div.setAttribute('id', 'idle')
    });
}


// UTILS functions
$('#project-clear').click(() => {
    close_all_divs()
});

$('#project-random').click(() => {
    close_all_divs();
    const content_divs = document.getElementsByClassName('content');
    const random_idx = Math.floor(Math.random() * content_divs.length);
    content_divs[random_idx].style.display = 'block';
})

$('#project-menu').click(() => {
    document.querySelector('div.nav-menu').style.display = 'flex';
});

// here we assign click listeners to navigate the different pages of the website
const nav_menu = document.getElementsByClassName('nav-menu-element');
for (const div of nav_menu) {
    // const div_ref = div.attributes.name.value;
    div.addEventListener('click', (event) => {
        const projects = ['project1', 'project2', 'project3', 'project4']
        const div_ref = div.attributes.name.value;
        for(const project of projects){
            const project_div = document.getElementById(project);
            if(project === div_ref){
                project_div.style.display = 'block';
            }else{
                project_div.style.display = 'none';
            }
        }
        document.querySelector('div.nav-menu').style.display = 'none';
    })
    // console.log(div.attributes.name.value)
}

function close_all_divs() {
    const open_divs = document.getElementsByClassName('content');
    for (const div of open_divs) {
        if (div.style.display === 'block') {
            div.style.display = 'none';
        }
    }
}