const endpoint = 'https://www.googleapis.com/books/v1/volumes?q=';
let mode;

async function postData(url, data){
  try{
    let response = await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type' : 'application/json'}
      },
    );
    //console.log(response)
    return response.ok;
  }catch(error){
    console.log(error);
    return false;
  }
}

async function putData(url, data){
  try{
    let response = await fetch(
      url,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {'Content-Type' : 'application/json'}
      },
    );
    //console.log(response);
  }catch(error){
    console.log(error);
  }
}

async function deleteData(url){
  try{
    let response = await fetch(
      url,
      {
        method: 'DELETE'
      },
    );
    //console.log(response);
    return response.ok;  
  }catch(error){
    console.log(error);
    return false;
  }
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
      'Authorization': `JWT ${token}`
    },
  });
  let mssg = await response.text();
  loadTable();
  M.toast({html: 'Book Added'});
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



