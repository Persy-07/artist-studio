import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Play, Pause, User, Heart, Share2, Music, Menu, X, Plus, Edit, Trash2, Users, BarChart3, Settings, Tag, UserPlus, FolderPlus } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  cover: string;
  description: string;
  playCount: number;
  date: string;
  category_name?: string;
  category_color?: string;
  file_path?: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  first_name: string;
  last_name: string;
  roles: string[];
  is_active: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at?: string;
}

const App: React.FC = () => {
  // Gestion d'état avec hooks
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // États admin étendus
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<'dashboard' | 'songs' | 'users' | 'categories'>('dashboard');
  const [adminStats, setAdminStats] = useState<any>({});
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminSongs, setAdminSongs] = useState<any[]>([]);
  const [adminCategories, setAdminCategories] = useState<Category[]>([]);
  
  // États modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  
  // États édition
  const [editingSong, setEditingSong] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/songs`);
      setSongs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des chansons:', error);
      setMessage('Erreur lors du chargement des chansons');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      if (searchTerm.trim() === '') {
        await loadSongs();
      } else {
        const response = await axios.get(`${API_BASE_URL}/songs?search=${searchTerm}`);
        setSongs(response.data);
      }
    } catch (error) {
      setMessage('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const loginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginData);
      setUser(response.data.user);
      setShowLoginModal(false);
      setMessage('Connexion réussie!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erreur de connexion');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const registerData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string
    };

    try {
      await axios.post(`${API_BASE_URL}/register`, registerData);
      setShowRegisterModal(false);
      setMessage('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erreur lors de la création du compte');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const logout = (): void => {
    setUser(null);
    setShowAdmin(false);
    setMessage('Déconnexion réussie');
    setTimeout(() => setMessage(''), 3000);
  };

  const playSong = async (song: Song): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/songs/${song.id}/play`);
      setCurrentSong(song);
      setIsPlaying(true);
      
      setSongs(prevSongs => 
        prevSongs.map(s => 
          s.id === song.id ? { ...s, playCount: s.playCount + 1 } : s
        )
      );
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
    }
  };

  const togglePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const openSongDetail = (song: Song): void => {
    setSelectedSong(song);
  };

  // Fonctions admin
  const loadAdminData = async (): Promise<void> => {
    try {
      const [statsRes, usersRes, songsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/dashboard`).catch(() => ({ data: {} })),
        axios.get(`${API_BASE_URL}/admin/users`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/admin/songs`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/admin/categories`).catch(() => ({ data: [] }))
      ]);
      setAdminStats(statsRes.data);
      setAdminUsers(usersRes.data);
      setAdminSongs(songsRes.data);
      setAdminCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erreur admin:', error);
    }
  };

  // CRUD Chansons
  const createSong = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const songData = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      duration: formData.get('duration') as string,
      genre: formData.get('genre') as string,
      description: formData.get('description') as string,
      category_id: formData.get('category_id') as string
    };

    try {
      if (editingSong) {
        await axios.put(`${API_BASE_URL}/admin/songs/${editingSong.id}`, songData);
        setMessage('Chanson modifiée avec succès!');
      } else {
        await axios.post(`${API_BASE_URL}/admin/songs`, songData);
        setMessage('Chanson créée avec succès!');
      }
      
      setShowCreateModal(false);
      setEditingSong(null);
      loadSongs();
      loadAdminData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erreur lors de la sauvegarde');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editSong = (song: any): void => {
    setEditingSong(song);
    setShowCreateModal(true);
  };

  const deleteSong = async (id: number): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chanson ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/songs/${id}`);
        setMessage('Chanson supprimée avec succès!');
        loadAdminData();
        loadSongs();
        setTimeout(() => setMessage(''), 3000);
      } catch (error: any) {
        setMessage('Erreur lors de la suppression');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  // CRUD Utilisateurs
  const createUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      role: formData.get('role') as string,
      isActive: formData.get('isActive') === 'on',
      ...(editingUser ? {} : { password: formData.get('password') as string })
    };

    try {
      if (editingUser) {
        await axios.put(`${API_BASE_URL}/admin/users/${editingUser.id}`, userData);
        setMessage('Utilisateur modifié avec succès!');
      } else {
        await axios.post(`${API_BASE_URL}/admin/users`, userData);
        setMessage('Utilisateur créé avec succès!');
      }
      
      setShowUserModal(false);
      setEditingUser(null);
      loadAdminData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erreur lors de la sauvegarde');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editUser = (user: any): void => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const deleteUser = async (id: number): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/users/${id}`);
        setMessage('Utilisateur supprimé avec succès!');
        loadAdminData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error: any) {
        setMessage(error.response?.data?.error || 'Erreur lors de la suppression');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  // CRUD Catégories
  const createCategory = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      color: formData.get('color') as string
    };

    try {
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/admin/categories/${editingCategory.id}`, categoryData);
        setMessage('Catégorie modifiée avec succès!');
      } else {
        await axios.post(`${API_BASE_URL}/admin/categories`, categoryData);
        setMessage('Catégorie créée avec succès!');
      }
      
      setShowCategoryModal(false);
      setEditingCategory(null);
      loadAdminData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erreur lors de la sauvegarde');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editCategory = (category: any): void => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const deleteCategory = async (id: number): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/categories/${id}`);
        setMessage('Catégorie supprimée avec succès!');
        loadAdminData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error: any) {
        setMessage(error.response?.data?.error || 'Erreur lors de la suppression');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const isAdmin = (): boolean => {
    return user?.roles?.includes('ROLE_ADMIN') || false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrateur';
      case 'ROLE_USER': return 'Utilisateur';
      default: return 'Utilisateur';
    }
  };

  // Interface admin avec sidebar et vues multiples
  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex">
        {/* Sidebar Admin */}
        <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">
              Admin Panel
            </h1>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setAdminView('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  adminView === 'dashboard' 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => setAdminView('songs')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  adminView === 'songs' 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Music className="h-5 w-5" />
                <span>Chansons</span>
              </button>
              
              <button 
                onClick={() => setAdminView('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  adminView === 'users' 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Utilisateurs</span>
              </button>
              
              <button 
                onClick={() => setAdminView('categories')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  adminView === 'categories' 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Tag className="h-5 w-5" />
                <span>Catégories</span>
              </button>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
              <button 
                onClick={() => setShowAdmin(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
                <span>Retour au site</span>
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all"
              >
                <User className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.includes('Erreur') 
                  ? 'bg-red-900/30 border-red-500/30 text-red-200' 
                  : 'bg-green-900/30 border-green-500/30 text-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* Dashboard */}
            {adminView === 'dashboard' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Chansons</p>
                        <p className="text-3xl font-bold text-white">{adminStats.total_songs || adminSongs.length}</p>
                      </div>
                      <Music className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Utilisateurs</p>
                        <p className="text-3xl font-bold text-white">{adminStats.total_users || adminUsers.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Catégories</p>
                        <p className="text-3xl font-bold text-white">{adminStats.total_categories || adminCategories.length}</p>
                      </div>
                      <Tag className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Écoutes Totales</p>
                        <p className="text-3xl font-bold text-white">{adminStats.total_plays || songs.reduce((acc, song) => acc + song.playCount, 0)}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gestion Chansons */}
            {adminView === 'songs' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Gestion des Chansons</h2>
                  <button
                    onClick={() => {
                      setEditingSong(null);
                      setShowCreateModal(true);
                    }}
                    className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white font-medium flex items-center space-x-2 hover:shadow-2xl hover:shadow-primary/30 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Ajouter Chanson</span>
                  </button>
                </div>

                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Titre</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Artiste</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Durée</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Genre</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Écoutes</th>
                          <th className="text-right px-6 py-4 text-gray-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminSongs.map((song) => (
                          <tr key={song.id} className="hover:bg-white/5 border-t border-white/10">
                            <td className="px-6 py-4 text-white font-medium">{song.title}</td>
                            <td className="px-6 py-4 text-gray-300">{song.artist}</td>
                            <td className="px-6 py-4 text-gray-300">{song.duration}</td>
                            <td className="px-6 py-4 text-gray-300">{song.genre || song.category_name}</td>
                            <td className="px-6 py-4 text-gray-300">{song.play_count || song.playCount || 0}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => editSong(song)}
                                  className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => deleteSong(song.id)}
                                  className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Gestion Utilisateurs */}
            {adminView === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h2>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setShowUserModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 rounded-xl text-white font-medium flex items-center space-x-2 hover:shadow-2xl hover:shadow-blue-600/30 transition-all"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Ajouter Utilisateur</span>
                  </button>
                </div>

                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Utilisateur</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Email</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Rôle</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left px-6 py-4 text-gray-300 font-medium">Date création</th>
                          <th className="text-right px-6 py-4 text-gray-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 border-t border-white/10">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {(user.first_name || user.firstName)?.[0]}{(user.last_name || user.lastName)?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">{user.first_name || user.firstName} {user.last_name || user.lastName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.roles?.includes('ROLE_ADMIN')
                                  ? 'bg-red-600/20 border border-red-500/30 text-red-300'
                                  : 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                              }`}>
                                {getRoleLabel(user.roles?.[0] || 'ROLE_USER')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.is_active 
                                  ? 'bg-green-600/20 border border-green-500/30 text-green-300'
                                  : 'bg-gray-600/20 border border-gray-500/30 text-gray-300'
                              }`}>
                                {user.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{formatDate(user.created_at)}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => editUser(user)}
                                  className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4 text-blue-400" />
                                </button>
                                {user.email !== 'admin@artiststudio.com' && (
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-400" />
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
              </div>
            )}

            {/* Gestion Catégories */}
            {adminView === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Gestion des Catégories</h2>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryModal(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 rounded-xl text-white font-medium flex items-center space-x-2 hover:shadow-2xl hover:shadow-green-600/30 transition-all"
                  >
                    <FolderPlus className="h-5 w-5" />
                    <span>Ajouter Catégorie</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminCategories.map((category) => (
                    <div key={category.id} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editCategory(category)}
                            className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/20"
                          style={{ backgroundColor: category.color + '40' }}
                        >
                          <Tag className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{category.name}</h3>
                          <p className="text-gray-400 text-sm">Créée le {formatDate(category.created_at)}</p>
                        </div>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-8 h-8 rounded-full border border-white/20"
                          style={{ backgroundColor: category.color }}
                          title={`Couleur: ${category.color}`}
                        ></div>
                        <span className="text-gray-500 text-xs">
                          #{category.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals Admin */}

        {/* Modal Créer/Modifier chanson */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingSong ? 'Modifier la chanson' : 'Ajouter une chanson'}
              </h2>
              
              <form onSubmit={createSong} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Titre"
                  required
                  defaultValue={editingSong?.title || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:bg-white/15 transition-all"
                />
                <input
                  type="text"
                  name="artist"
                  placeholder="Artiste"
                  required
                  defaultValue={editingSong?.artist || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:bg-white/15 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="duration"
                    placeholder="Durée (3:30)"
                    required
                    defaultValue={editingSong?.duration || ''}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:bg-white/15 transition-all"
                  />
                  <select
                    name="genre"
                    required
                    defaultValue={editingSong?.category_name || editingSong?.genre || ''}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:border-primary focus:bg-white/15 transition-all"
                  >
                    <option value="">Genre</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Acoustic">Acoustic</option>
                  </select>
                </div>
                
                <select
                  name="category_id"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:border-primary focus:bg-white/15 transition-all"
                >
                  <option value="">Aucune catégorie</option>
                  {adminCategories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-gray-800">
                      {cat.name}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  placeholder="Description / Article"
                  rows={4}
                  required
                  defaultValue={editingSong?.description || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:bg-white/15 transition-all"
                ></textarea>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingSong(null);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white hover:shadow-2xl hover:shadow-primary/30 transition-all"
                  >
                    {editingSong ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Créer/Modifier utilisateur */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h2>
              
              <form onSubmit={createUser} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  defaultValue={editingUser?.email || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white/15 transition-all"
                />
                
                {!editingUser && (
                  <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    required={!editingUser}
                    minLength={6}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white/15 transition-all"
                  />
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    required
                    defaultValue={editingUser?.first_name || editingUser?.firstName || ''}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white/15 transition-all"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    required
                    defaultValue={editingUser?.last_name || editingUser?.lastName || ''}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white/15 transition-all"
                  />
                </div>
                
                <select
                  name="role"
                  defaultValue={editingUser?.roles?.[0] || 'ROLE_USER'}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:bg-white/15 transition-all"
                >
                  <option value="ROLE_USER" className="bg-gray-800">Utilisateur</option>
                  <option value="ROLE_ADMIN" className="bg-gray-800">Administrateur</option>
                </select>
                
                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingUser ? Boolean(editingUser.is_active) : true}
                    className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span>Compte actif</span>
                </label>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white hover:shadow-2xl hover:shadow-blue-600/30 transition-all"
                  >
                    {editingUser ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Créer/Modifier catégorie */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h2>
              
              <form onSubmit={createCategory} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom de la catégorie"
                  required
                  defaultValue={editingCategory?.name || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:bg-white/15 transition-all"
                />
                
                <textarea
                  name="description"
                  placeholder="Description (optionnelle)"
                  rows={3}
                  defaultValue={editingCategory?.description || ''}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:bg-white/15 transition-all"
                />
                
                <div className="space-y-2">
                  <label className="text-white text-sm">Couleur</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="color"
                      defaultValue={editingCategory?.color || '#8B5CF6'}
                      className="w-12 h-12 border border-white/20 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#8B5CF6"
                      defaultValue={editingCategory?.color || '#8B5CF6'}
                      className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:bg-white/15 transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white hover:shadow-2xl hover:shadow-green-600/30 transition-all"
                  >
                    {editingCategory ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Interface publique (votre code existant - INCHANGÉ)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-dark/95 backdrop-blur-lg border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-xl">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Artist Studio
                </h1>
                <p className="text-xs text-gray-400">Blog Musical</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
              <a href="#songs" className="text-gray-300 hover:text-white transition-colors">Chansons</a>
              <a href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">Bonjour {user.firstName}!</span>
                  {isAdmin() && (
                    <button 
                      onClick={() => {
                        setShowAdmin(true);
                        loadAdminData();
                      }}
                      className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium"
                    >
                      Admin
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Se connecter</span>
                </button>
              )}
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="space-y-2">
                <a href="#home" className="block text-gray-300 hover:text-white py-2">Accueil</a>
                <a href="#songs" className="block text-gray-300 hover:text-white py-2">Chansons</a>
                <a href="#blog" className="block text-gray-300 hover:text-white py-2">Blog</a>
                {user ? (
                  <>
                    {isAdmin() && (
                      <button 
                        onClick={() => {
                          setShowAdmin(true);
                          loadAdminData();
                        }}
                        className="block w-full text-left bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium"
                      >
                        Administration
                      </button>
                    )}
                    <button onClick={logout} className="block w-full text-left bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="block w-full text-left bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-lg text-white font-medium">
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mx-auto max-w-4xl px-4 py-3 my-4 rounded-lg text-center ${
          message.includes('Erreur') 
            ? 'bg-red-900/20 border border-red-500/30 text-red-200' 
            : 'bg-green-900/20 border border-green-500/30 text-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900/20 via-background/40 to-pink-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6">
            Artist Studio
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Découvrez notre blog musical où chaque chanson raconte une histoire unique à travers des articles détaillés
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-full p-2">
                <div className="flex items-center">
                  <Search className="ml-6 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une chanson, un genre, un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-400 outline-none text-lg"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                  >
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="text-5xl mb-6">🎵</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Créations</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {songs.length}
              </div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Écoutes</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {songs.reduce((acc, song) => acc + song.playCount, 0)}
              </div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="text-5xl mb-6">❤️</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Likes</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                156
              </div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Disponible</h3>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section chansons */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos Articles Musicaux
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Découvrez nos dernières créations à travers des articles de blog détaillés ({songs.length} articles)
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {songs.map(song => (
                <article key={song.id} className="group bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
                        {song.cover}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {song.title}
                      </h3>
                      <p className="text-gray-400 mb-3 text-lg">{song.artist} • {song.genre}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center space-x-1">
                          <span>👁</span>
                          <span>{song.playCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>89</span>
                        </span>
                        <span>📅 {song.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className="text-gray-400 font-semibold">{song.duration}</span>
                      <button 
                        onClick={() => playSong(song)}
                        className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-110 transition-all duration-300"
                      >
                        <Play className="h-7 w-7 text-white ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed line-clamp-3">
                      {song.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button 
                      onClick={() => openSongDetail(song)}
                      className="text-primary hover:text-secondary transition-colors font-medium"
                    >
                      Lire l'article complet →
                    </button>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                        <Heart className="h-4 w-4 text-gray-400 hover:text-secondary transition-colors" />
                      </button>
                      <button className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                        <Share2 className="h-4 w-4 text-gray-400 hover:text-primary transition-colors" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Player Audio fixe */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-2xl border-t border-primary/20 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-60 animate-pulse"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-lg">
                    {currentSong.cover}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white">{currentSong.title}</div>
                  <div className="text-gray-400 text-sm">{currentSong.artist}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <button className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <Heart className="h-5 w-5 text-gray-400 hover:text-secondary transition-colors" />
                </button>
                <button 
                  onClick={togglePlayPause}
                  className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                >
                  {isPlaying ? 
                    <Pause className="h-7 w-7 text-white" /> : 
                    <Play className="h-7 w-7 text-white ml-0.5" />
                  }
                </button>
                <button className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <Share2 className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Article Détaillé */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-4xl">
                    {selectedSong.cover}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{selectedSong.title}</h1>
                    <p className="text-xl text-gray-400">{selectedSong.artist} • {selectedSong.genre}</p>
                    <p className="text-gray-500 mt-2">📅 {selectedSong.date} • ⏱ {selectedSong.duration}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSong(null)}
                  className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <article className="prose prose-invert prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-white mb-6">L'Histoire de cette création</h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <p>{selectedSong.description}</p>
                  <p>Cette chanson représente un moment particulier dans notre parcours artistique. Chaque note a été pensée pour véhiculer une émotion précise, chaque parole choisie avec soin pour raconter une histoire qui résonne avec nos auditeurs.</p>
                  <p>Le processus de création a duré plusieurs mois, durant lesquels nous avons exploré différentes sonorités et arrangements pour arriver au résultat final que vous pouvez découvrir aujourd'hui.</p>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Détails Techniques</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Genre:</span>
                      <span className="text-white ml-2">{selectedSong.genre}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Durée:</span>
                      <span className="text-white ml-2">{selectedSong.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Écoutes:</span>
                      <span className="text-white ml-2">{selectedSong.playCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white ml-2">{selectedSong.date}</span>
                    </div>
                  </div>
                </div>
              </article>

              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => playSong(selectedSong)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-2xl text-white font-semibold hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="h-6 w-6" />
                  <span>Écouter maintenant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-25"></div>
            <div className="relative bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-10">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Bienvenue</h2>
                <p className="text-gray-400 text-lg">Accédez à votre espace musical</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                >
                  Se connecter
                </button>
                <div className="text-center">
                  <span className="text-gray-400">Pas de compte ? </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowRegisterModal(true);
                    }}
                    className="text-secondary hover:text-pink-300 underline"
                  >
                    S'inscrire
                  </button>
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>Demo: admin@artiststudio.com / admin2024</p>
                </div>
              </form>

              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'inscription */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-25"></div>
            <div className="relative bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Inscription</h2>
                <p className="text-gray-400 text-lg">Rejoignez notre blog musical</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-primary focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
                >
                  S'inscrire
                </button>
                <div className="text-center">
                  <span className="text-gray-400">Déjà un compte ? </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowRegisterModal(false);
                      setShowLoginModal(true);
                    }}
                    className="text-secondary hover:text-pink-300 underline"
                  >
                    Se connecter
                  </button>
                </div>
              </form>

              <button 
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;