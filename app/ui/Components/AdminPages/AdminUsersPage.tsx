"use client";
import { useState, useEffect } from "react";
import UserForm from "./UserForm"; // Formulaire pour ajouter/modifier un utilisateur

const AdminUsersPage = () => {
    const [users, setUsers] = useState<{ id: string; nom: string; prenom: string; mail: string; role: string; niveau?: string }[]>([]);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("Tous");
    const [search, setSearch] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false); // ✅ Ajout d'un état pour afficher le formulaire

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/users");
                if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                setError("Impossible de récupérer les utilisateurs");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (filter !== "Tous") {
            result = result.filter(user => user.role === filter);
        }

        if (search) {
            result = result.filter(user =>
                user.nom.toLowerCase().includes(search.toLowerCase()) ||
                user.prenom.toLowerCase().includes(search.toLowerCase()) ||
                user.mail.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredUsers(result);
    }, [filter, search, users]);

    const handleFilter = (role: string) => {
        setFilter(role);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">👥 Gérer les utilisateurs</h1>

            {/* ✅ Bouton Ajouter */}
            <button
                onClick={() => setIsAdding(true)}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
            >
                ➕ Ajouter un utilisateur
            </button>

            {/* ✅ Affichage du formulaire d'ajout */}
            {isAdding && (
                <UserForm
                    onClose={() => setIsAdding(false)}
                    onAdd={(newUser) => {
                        setUsers([...users, newUser]); // Ajoute l'utilisateur dans la liste
                        setIsAdding(false); // Ferme le formulaire
                    }}
                />
            )}

            {/* ✅ Barre de recherche */}
            <input
                type="text"
                placeholder="🔍 Rechercher un utilisateur..."
                className="w-full p-2 border rounded mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ✅ Filtres */}
            <div className="mb-4 flex gap-2">
                <button onClick={() => handleFilter("Tous")} className={`px-4 py-2 rounded border ${filter === "Tous" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
                    Tous
                </button>
                <button onClick={() => handleFilter("Élève")} className={`px-4 py-2 rounded border ${filter === "Élève" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
                    Élèves
                </button>
                <button onClick={() => handleFilter("Professeur")} className={`px-4 py-2 rounded border ${filter === "Professeur" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
                    Profs
                </button>
                <button onClick={() => handleFilter("Admin")} className={`px-4 py-2 rounded border ${filter === "Admin" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
                    Admins
                </button>
            </div>

            {/* ✅ Table des utilisateurs */}
            {loading ? (
                <p>Chargement...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Nom</th>
                            <th className="border p-2">Prénom</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Rôle</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border">
                                <td className="border p-2">{user.id}</td>
                                <td className="border p-2">{user.nom}</td>
                                <td className="border p-2">{user.prenom}</td>
                                <td className="border p-2">{user.mail}</td>
                                <td className="border p-2">{user.role}</td>
                                <td className="border p-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">Modifier</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsersPage;