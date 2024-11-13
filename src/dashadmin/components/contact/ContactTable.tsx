import React, { useState } from 'react';
import { Mail, Phone, Archive, CheckCircle, Trash2, Tag } from 'lucide-react';
import { Contact } from '../../types/contact';
import { useContactActions } from '../../hooks/useContactActions';

interface ContactTableProps {
  contacts: Contact[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const { toggleReadStatus, toggleArchiveStatus, deleteContact } = useContactActions();

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'financing':
        return { text: 'Financiamento', color: 'bg-blue-100 text-blue-800' };
      case 'vehicle':
        return { text: 'Veículo', color: 'bg-green-100 text-green-800' };
      default:
        return { text: 'Geral', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Origem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Mensagem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className={`hover:bg-gray-50 ${!contact.is_read ? 'bg-blue-50' : ''}`}>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleReadStatus(contact)}
                    className={`p-1 rounded-full ${
                      contact.is_read ? 'text-green-600' : 'text-gray-400'
                    }`}
                    title={contact.is_read ? 'Marcar como não lido' : 'Marcar como lido'}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${contact.email}`} className="hover:text-primary">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${contact.phone}`} className="hover:text-primary">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getSourceLabel(contact.source).color}`}>
                      {getSourceLabel(contact.source).text}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                    {contact.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(contact.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleArchiveStatus(contact)}
                      className={`p-1 rounded-full ${
                        contact.is_archived ? 'text-yellow-600' : 'text-gray-400'
                      }`}
                      title={contact.is_archived ? 'Desarquivar' : 'Arquivar'}
                    >
                      <Archive className="h-5 w-5" />
                    </button>
                    {showDeleteConfirm === contact.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            deleteContact(contact.id);
                            setShowDeleteConfirm(null);
                          }}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(contact.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}