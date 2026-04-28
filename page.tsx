'use client';

import React, { useMemo, useState } from 'react';
import { Bike, ChefHat, CreditCard, Home, MapPin, Minus, Plus, Settings, ShoppingCart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MENU = [
  { id: 1, category: 'Kebab', name: 'Kebab Rulle', price: 8.5, popular: true },
  { id: 2, category: 'Kebab', name: 'Kebab Tallrik', price: 10.5, popular: true },
  { id: 3, category: 'Pizza', name: 'Margarita', price: 8.0, popular: false },
  { id: 4, category: 'Pizza', name: 'Kebab Pizza', price: 11.5, popular: true },
  { id: 5, category: 'Burgare', name: 'Ninos Burger', price: 9.5, popular: false },
  { id: 6, category: 'Dryck', name: 'Coca-Cola 33cl', price: 2.0, popular: false },
];

function euro(n: number) { return `${n.toFixed(2)} €`; }

type CartItem = typeof MENU[number] & { qty: number };
type Order = { id: string; name: string; phone: string; address: string; items: CartItem[]; total: number; status: string; driver: string };

export default function Page() {
  const [view, setView] = useState<'shop' | 'kitchen' | 'driver' | 'admin'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const delivery = cart.length ? 2 : 0;
  const total = subtotal + delivery;

  function add(item: typeof MENU[number]) {
    setCart(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) return current.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...current, { ...item, qty: 1 }];
    });
  }

  function qty(id: number, change: number) {
    setCart(current => current.map(i => i.id === id ? { ...i, qty: i.qty + change } : i).filter(i => i.qty > 0));
  }

  function sendOrder() {
    if (!cart.length || !customer.name || !customer.phone || !customer.address) {
      alert('Fyll i kunduppgifter och lägg till mat.');
      return;
    }
    setOrders([{ id: `NK-${Date.now().toString().slice(-6)}`, ...customer, items: cart, total, status: 'Ny order', driver: 'Ej tilldelad' }, ...orders]);
    setCart([]);
    setCustomer({ name: '', phone: '', address: '' });
    setView('kitchen');
  }

  function updateOrder(id: string, patch: Partial<Order>) {
    setOrders(current => current.map(o => o.id === id ? { ...o, ...patch } : o));
  }

  return (
    <main className="min-h-screen bg-neutral-100 pb-20">
      <header className="bg-neutral-950 text-white p-6">
        <p className="text-orange-300 text-sm tracking-widest uppercase">Palma · Avinguda de l&apos;Argentina 8</p>
        <h1 className="text-4xl font-bold mt-1">Ninos Kebab</h1>
        <p className="text-neutral-300 mt-2">Demo: egen beställningsapp med kund, kök, chaufför och admin.</p>
        <div className="hidden md:flex gap-2 mt-5">
          <Button variant="secondary" onClick={() => setView('shop')}>Kund</Button>
          <Button variant="secondary" onClick={() => setView('kitchen')}>Kök</Button>
          <Button variant="secondary" onClick={() => setView('driver')}>Chaufför</Button>
          <Button variant="secondary" onClick={() => setView('admin')}>Admin</Button>
        </div>
      </header>

      {view === 'shop' && <section className="max-w-6xl mx-auto p-4 grid lg:grid-cols-[1fr_360px] gap-5">
        <div>
          <div className="rounded-3xl bg-gradient-to-br from-neutral-950 to-neutral-800 text-white p-6 mb-5">
            <h2 className="text-3xl font-bold">Beställ direkt från Ninos</h2>
            <p className="text-neutral-300 mt-2">Snabbare leverans, egen kontroll och app-känsla i mobilen.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENU.map(item => <Card key={item.id} className="rounded-3xl border-0"><CardContent className="p-5">
              <p className="text-sm text-orange-600 font-semibold">{item.category}</p>
              <div className="flex justify-between mt-1"><h3 className="font-bold text-xl">{item.name}</h3><b>{euro(item.price)}</b></div>
              {item.popular && <p className="text-xs mt-2 text-orange-700">Populär</p>}
              <Button className="w-full rounded-2xl mt-4" onClick={() => add(item)}><Plus size={16} className="mr-2" /> Lägg till</Button>
            </CardContent></Card>)}
          </div>
        </div>
        <Card className="rounded-3xl border-0 h-fit"><CardContent className="p-5 space-y-4">
          <h2 className="text-2xl font-bold flex gap-2"><ShoppingCart /> Varukorg</h2>
          {cart.length === 0 && <p className="text-neutral-500">Tom varukorg.</p>}
          {cart.map(item => <div key={item.id} className="flex justify-between items-center bg-neutral-100 rounded-2xl p-3">
            <div><b>{item.name}</b><p className="text-sm">{euro(item.price * item.qty)}</p></div>
            <div className="flex items-center gap-2"><Button size="icon" variant="outline" onClick={() => qty(item.id, -1)}><Minus size={14}/></Button><b>{item.qty}</b><Button size="icon" variant="outline" onClick={() => qty(item.id, 1)}><Plus size={14}/></Button></div>
          </div>)}
          <input className="w-full border rounded-xl p-3" placeholder="Namn" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}/>
          <input className="w-full border rounded-xl p-3" placeholder="Telefon" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })}/>
          <input className="w-full border rounded-xl p-3" placeholder="Adress" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}/>
          <div className="bg-neutral-100 rounded-2xl p-4 space-y-1"><p>Mat: {euro(subtotal)}</p><p>Leverans: {euro(delivery)}</p><p className="font-bold text-xl">Totalt: {euro(total)}</p></div>
          <Button className="w-full rounded-2xl h-12" onClick={sendOrder}><CreditCard className="mr-2" size={18}/> Skicka order</Button>
        </CardContent></Card>
      </section>}

      {view === 'kitchen' && <section className="max-w-6xl mx-auto p-4"><h2 className="text-3xl font-bold mb-4 flex gap-2"><ChefHat/> Kök</h2><div className="grid md:grid-cols-2 gap-4">{orders.map(order => <Card key={order.id} className="rounded-3xl"><CardContent className="p-5"><h3 className="font-bold text-xl">{order.id}</h3><p>{order.name} · {order.phone}</p><p className="text-neutral-600">{order.address}</p><div className="my-3">{order.items.map(i => <p key={i.id}>{i.qty}x {i.name}</p>)}</div><b>{euro(order.total)}</b><p className="mt-2">Status: {order.status}</p><Button className="mt-4 rounded-2xl" onClick={() => updateOrder(order.id, { status: 'Klar för leverans' })}>Klar för leverans</Button></CardContent></Card>)}</div></section>}

      {view === 'driver' && <section className="max-w-6xl mx-auto p-4"><h2 className="text-3xl font-bold mb-4 flex gap-2"><Truck/> Chaufför</h2><div className="grid md:grid-cols-2 gap-4">{orders.map(order => <Card key={order.id} className="rounded-3xl"><CardContent className="p-5"><h3 className="font-bold text-xl">{order.id}</h3><p className="flex gap-2"><MapPin/> {order.address}</p><p>Status: {order.status}</p><select className="w-full border rounded-xl p-3 mt-3" value={order.driver} onChange={e => updateOrder(order.id, { driver: e.target.value })}><option>Ej tilldelad</option><option>Chaufför 1</option><option>Chaufför 2</option><option>Chaufför 3</option></select><Button className="mt-3 rounded-2xl" onClick={() => updateOrder(order.id, { status: 'Levererad' })}>Markera levererad</Button></CardContent></Card>)}</div></section>}

      {view === 'admin' && <section className="max-w-6xl mx-auto p-4"><h2 className="text-3xl font-bold mb-4 flex gap-2"><Settings/> Admin</h2><div className="grid md:grid-cols-3 gap-4"><Card><CardContent><p>Ordrar</p><b className="text-3xl">{orders.length}</b></CardContent></Card><Card><CardContent><p>Försäljning</p><b className="text-3xl">{euro(orders.reduce((s,o)=>s+o.total,0))}</b></CardContent></Card><Card><CardContent><p>Status</p><b className="text-3xl">Demo</b></CardContent></Card></div></section>}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg grid grid-cols-4 py-2 md:hidden">
        <button onClick={() => setView('shop')} className="flex flex-col items-center text-xs"><Home/>Beställ</button>
        <button onClick={() => setView('kitchen')} className="flex flex-col items-center text-xs"><ChefHat/>Kök</button>
        <button onClick={() => setView('driver')} className="flex flex-col items-center text-xs"><Bike/>Bud</button>
        <button onClick={() => setView('admin')} className="flex flex-col items-center text-xs"><Settings/>Admin</button>
      </nav>
    </main>
  );
}
