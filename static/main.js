const endpoint = 'https://www.googleapis.com/books/v1/volumes?q=';
let mode;
let token = "";
let selected = "";

async function postData(url = '', data = {}, token) {
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        },
        body: JSON.stringify(data)
    });
    if(response.ok)
        return response.text(); 
    throw response.status;
}

async function getData(url = '', token){
    const response = await fetch(url ,{
      headers:{'Authorization': `JWT ${token}`}
    });
    if(response.ok)
        return response.json(); 
    throw response.status;
}


async function loadTable(){
    let table = document.querySelector('#myBookListing');
    let data = await getData(server+'/mybooks', token);
    let i = 1;
    table.innerHTML = "";
    for(let rec of data){
      table.innerHTML+=`<tr>
                          <td>${rec.data.volumeInfo.title}</td>
                          <td>${rec.data.volumeInfo.author}</td>
                          <td>
                            <a class="waves-effect waves-light btn" onclick="deleteBook(${i})"><i class="material-icons left">delete</i>Delete</a>
                          </td>
                        </tr>`;
      i++;
    }
}

async function addbook (id) {
let response = await postData(`${server}/mybooks/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',  
      'Authorization': `JWT ${token}`
    },
  });
  let msg = await response.text();
  M.toast({html: 'Book Added'});
  loadTable();
  
}


async function deleteBook(id){
  let response = await fetch(`${server}/mybooks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `JWT ${token}`
    },
  });
  let mssg = await response.text();
  loadTable();
  M.toast({html: 'Deleted'});
}



document.addEventListener('DOMContentLoaded', function() {
    loadTable();

});
