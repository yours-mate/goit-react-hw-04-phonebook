import { useState, useEffect, useMemo } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactsList } from './ContactsList/ContactsList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';

export function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      setContacts(parsedContacts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleFormSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const newContact = { id: nanoid(), name: '', number: '' };
    newContact.name = form.elements.name.value;
    newContact.number = form.elements.number.value;
    handleSubmit(newContact);
  };

  const handleSubmit = newContact => {
    const names = contacts.map(c => c.name.toLowerCase());
    if (names.includes(newContact.name.toLowerCase())) {
      alert(`${newContact.name} is already in the contacts list.`);
      return;
    } else {
      setContacts([...contacts, newContact]);
      document.getElementById('form').reset();
    }
  };

  const handleFilterState = evt => {
    setFilter(evt.target.value);
  };

  const handleBtnDeleteClick = e => {
    const targetId = e.target.name;
    handleDelete(targetId);
  };

  const handleDelete = targetId => {
    setContacts(contacts.filter(({ id }) => id !== targetId));
  };

  const searchedContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [contacts, filter]);
  return (
    <div
      style={{
        height: '100vh',
        fontSize: 20,
        color: '#010101',
        padding: '40px',
      }}
    >
      <h1>Phonebook</h1>
      <ContactForm handleSubmit={handleFormSubmit} />
      <h2>Contacts</h2>
      <Filter handleFilterState={handleFilterState} />
      {contacts.length > 0 && (
        <ContactsList
          contacts={searchedContacts}
          handleDelete={handleBtnDeleteClick}
        />
      )}
    </div>
  );
}
