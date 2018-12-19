const wpcom = WPCOM();
const blog = wpcom.site('jonasgillman.wordpress.com');
const data = [];
blog.postsList({ number: 100 })
    .then(list => {
        console.log(list)
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

function extractImgs(data){
    const result = [];
    Object.keys(data).forEach(key => {
        result.push(data[key].URL);
    })
    console.log(result);
    return result;
}
// let data;

// const URL = 'http://localhost:5000/wp';
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
//                 short: currentValue.excerpt
//             };
//             return accumulator;
//         }, {});

//         console.log(web_content);
//         render_web_page(web_content);
//     })
//     .catch(err => console.log(err))

function render_web_page(content) {
    const img_sizes = {
        large : '?w=1024',
        small : '?w=300',
        thumbnail : '?w=150'
    };
    
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
        el_title.innerText = project_title;
        Object.keys(content[project]).forEach(title => {
            // here we do two things
            // create a div element with the content
            const content_div = document.createElement('div');
            content_div.setAttribute('class', 'content');
            const content_text = document.createElement('div');
            content_text.setAttribute('class', 'content-text');
            content_text.innerHTML = content[project][title].text;
            content_div.appendChild(content_text);
            const header = document.createElement('div')
            header.setAttribute('class', 'content-header');
            const header_title = document.createElement('div');
            header_title.setAttribute('class', 'header-title');
            header_title.innerText = title;
            header.appendChild(header_title);
            // header.innerText = title;
            // here we need to add a close button
            const header_btns = document.createElement('div');
            header_btns.setAttribute('class', 'content-buttons');
            // if device we make only close button
            const close_btn = document.createElement('div');
            close_btn.setAttribute('class', 'close-button');
            close_btn.onclick = () => $(content_div).toggle('fast');
            header_btns.appendChild(close_btn);

            const enlarge_btn = document.createElement('div');
            enlarge_btn.setAttribute('class', 'enlarge-button');
            enlarge_btn.onclick = () => {
                $(content_div).width(innerWidth - 100).height(innerHeight - 100).css({ top: 50, left: 50 });
                // content_text.style.height
            }
            header_btns.appendChild(enlarge_btn);

            const reduce_btn = document.createElement('div');
            reduce_btn.setAttribute('class', 'reduce-button');
            reduce_btn.onclick = () => {
                $(content_div).width(300).height(innerHeight * 0.65);
            };
            header_btns.appendChild(reduce_btn);

            header.insertBefore(header_btns, header.firstChild);
            content_div.insertBefore(header, content_div.firstChild);
            const id_name = 'content' + id_index;
            content_div.setAttribute('id', id_name);
            const gutter = 50;
            const w = Math.floor(Math.random() * (innerWidth - 300));//correct this!
            const h = Math.floor(Math.random() * (innerHeight - 300));
            content_div.style.top = h + 'px';
            content_div.style.left = w + 'px';

            content_div.style.position.fixed;

            project_container.appendChild(content_div);
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
            console.log(project, title)
            id_index++;
        });
        index++;
    });
}