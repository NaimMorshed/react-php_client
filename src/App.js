import './App.css';
import { useState, useRef } from 'react';

const tailwind = {
  parent: 'min-h-screen grid place-content-center p-5',
  readSection: 'border-2 rounded p-3 mb-4 flex flex-col justify-center align-middle',
  readArea: 'grid place-content-center',
  txtProducts: 'font-bold text-xl text-center',
  boxContainer: 'flex flex-wrap',
  box: 'border-3 rounded-xl p-4 text-center m-2',
  btnUpdate: 'bg-gray-200 px-3 py-1 rounded my-2',
  btnDelete: 'bg-red-200 px-3 py-1 rounded',
  btnLoad: 'bg-emerald-300 px-5 py-2 rounded-lg font-bold mb-3',
  form: 'border-2 rounded p-4 bg-slate-300 flex flex-col',
  inputText: 'mb-3 px-3 py-2 rounded-lg',
  inputSubmit: 'bg-red-300 px-5 py-2 rounded-lg font-bold',
  txtMsg: 'text-bold mt-2 text-center text-xl',
  txtTitle: 'font-bold',
}

export default function App() {
  const [msg, setMsg] = useState(null);
  const [updateId, setId] = useState(null);
  const [submitValue, setValue] = useState('INSERT');
  const [data, setData] = useState([]);
  const { parent, readSection, readArea, txtProducts, boxContainer, box, btnUpdate, btnDelete, btnLoad, form, inputText, inputSubmit, txtMsg, txtTitle } = tailwind;

  const titleRef = useRef('');
  const qtyRef = useRef('');
  const priceRef = useRef('');

  const clear = (title = '', qty = '', price = '') => {
    document.getElementById('title').value = title;
    document.getElementById('qty').value = qty;
    document.getElementById('price').value = price;
  }

  const formSubmit = e => {
    e.preventDefault();
    submitValue === 'INSERT' ? createDB() : updateDB()
  }

  const createDB = async () => {
    const response = await fetch(`http://localhost/shop/create.php?title='${titleRef.current.value}'&qty=${qtyRef.current.value}&price=${priceRef.current.value}`);
    const dt = await response.json();
    setMsg(dt);
    read();
    clear();
    setValue('INSERT');
  }

  const deleteDB = async (id) => {
    const response = await fetch(`http://localhost/shop/delete.php?id=${id}`);
    const dt = await response.json();
    setMsg(dt);
    read();
  }

  const updateDB = async () => {
    const response = await fetch(`http://localhost/shop/update.php?id=${updateId}&title='${titleRef.current.value}'&qty=${qtyRef.current.value}&price=${priceRef.current.value}`);
    const dt = await response.json();
    setMsg(dt);
    read();
    clear();
    setValue('INSERT');
  }

  const alter = ({ id, title, qty, price }) => {
    setId(id);
    setMsg(null);
    setValue('UPDATE');
    clear(title, qty, price);
  }

  const read = async () => {
    const response = await fetch('http://localhost/shop/read.php');
    const dt = await response.json();
    setData(dt);
  }

  return (
    <div className={parent}>
      <section className={readSection}>
        <div className={readArea}>
          <span className={txtProducts}>PRODUCTS</span>
          <div className={boxContainer}>
            {
              data.map(data =>
                <div className={box}>
                  <h3 className={txtTitle}>Title: {data.TITLE}</h3>
                  <p>ID: {data.ID}</p>
                  <p>QTY: {data.QTY}</p>
                  <p>Price: ${data.PRICE}</p>
                  <button onClick={() => alter({ id: data.ID, title: data.TITLE, qty: data.QTY, price: data.PRICE })} className={btnUpdate}>Update</button>
                  <br />
                  <button onClick={() => deleteDB(data.ID)} className={btnDelete}>Delete</button>
                </div>
              )
            }
          </div>
        </div>
        <button className={btnLoad} onClick={read}>LOAD</button>
      </section>

      <form onSubmit={formSubmit} className={form}>
        <input onClick={() => setMsg(null)} id='title' ref={titleRef} className={inputText} type="text" placeholder='Title' required />
        <input onClick={() => setMsg(null)} id='qty' ref={qtyRef} className={inputText} type="number" placeholder='Quantity' required />
        <input onClick={() => setMsg(null)} id='price' ref={priceRef} className={inputText} type="number" placeholder='Price' required />
        <input className={inputSubmit} type='submit' value={submitValue} />
        {
          msg && <span className={txtMsg}>{msg}</span>
        }
      </form>
    </div>
  );
}