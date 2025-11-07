// Améliorations pour l'upload de photos - Profile.jsx

// 1. Dans la section photo de profil, remplacer l'image actuelle par :
<img
src={preview}
alt="Profil"
className={`h-28 w-28 rounded-full object-cover border-4 border-cyan-500 shadow-md ${uploadingPhoto ? 'opacity-50' : ''}`}
/>

// 2. Ajouter un indicateur de chargement après l'image :
{uploadingPhoto && (

  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)}

// 3. Modifier le label pour le bouton "Changer" :
<label
htmlFor="photo"
className={`absolute bottom-0 right-0 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full transition ${
    uploadingPhoto ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-600'
  }`}

> {uploadingPhoto ? 'Chargement...' : 'Changer'}
> </label>

// 4. Ajouter disabled au input :
<input
  id="photo"
  type="file"
  accept="image/*"
  onChange={handlePhotoChange}
  disabled={uploadingPhoto}
  className="hidden"
/>
