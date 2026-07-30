import React, { useState } from 'react';
import { Lock, Camera, Trash2, Shield } from 'lucide-react';

export default function SecureVault() {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedVaultPin = localStorage.getItem('cwb_vault_pwd') || '1234';
    if (pin === savedVaultPin) {
      setAuthenticated(true);
    } else {
      alert('తప్పుడు పాస్‌వర్డ్ / Invalid PIN');
      setPin('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos([...photos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (!authenticated) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg text-center space-y-4">
        <Lock className="w-12 h-12 text-[#082c75] mx-auto" />
        <h3 className="font-bold text-gray-800">సీక్రెట్ వాల్ట్ / Secret Vault</h3>
        <p className="text-xs text-gray-500">పాస్‌వర్డ్ లేదా పిన్ ఎంటర్ చేయండి</p>
        <form onSubmit={handlePinSubmit} className="space-y-2">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-center font-mono tracking-widest"
            placeholder="PIN"
            maxLength={32}
          />
          <button type="submit" className="w-full bg-[#082c75] text-white py-2 rounded-lg font-bold text-xs">
            అన్‌లాక్ చేయండి / Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          సీక్రెట్ ఫోటోలు
        </h3>
        <label className="cursor-pointer bg-emerald-600 text-white p-2 rounded-lg">
          <Camera className="w-4 h-4" />
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img loading="lazy" decoding="async" src={photo} alt="secret" className="w-full h-20 object-cover rounded-lg" />
            <button
              onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
