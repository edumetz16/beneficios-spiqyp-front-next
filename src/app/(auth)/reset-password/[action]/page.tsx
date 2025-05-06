'use client';

import { useState } from 'react';
import { Button, Input, Image, Spinner } from '@heroui/react';
import { getFirebaseAuth } from '@/services/firebase/firebase.client';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from "@/services/auth/auth.client";

export default function ResetPasswordActionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!oobCode) {
      setMessage('Enlace Inválido');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(oobCode, password);
      setMessage('Contraseña restablecida exitosamente');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      console.error('Error al restablecer la contraseña:', error);
      setMessage('Este enlace de restablecimiento de contraseña es inválido o ha expirado.');
    }
  };

  if (!oobCode) {
    return (
      <div>
        <p className={`text-xl font-bold text-primary text-center w-full`}>Enlace Inválido</p>
        <p className={`mt-2 text-sm text-gray-500 text-left w-full`}>Este enlace de restablecimiento de contraseña es inválido o ha expirado.</p>
      </div>
    );
  }

  return (
    <div>
      <p className={`text-xl font-bold text-primary text-center w-full`}>Establecer Nueva Contraseña</p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 my-4 text-black">
          <Input
            name="password"
            className="flex items-center"
            label="Nueva contraseña"
            variant="bordered"
            required
            endContent={
              <button className="focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Image src="/img/icons/eye-slash.svg" alt="eye-view" width={24} height={24} />
                ) : (
                  <Image src="/img/icons/eye-view.svg" alt="eye-slash" width={24} height={24} />
                )}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
          />

          <Input
            name="confirmPassword"
            className="flex items-center"
            label="Confirmar contraseña"
            variant="bordered"
            required
            endContent={
              <button className="focus:outline-none" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <Image src="/img/icons/eye-slash.svg" alt="eye-view" width={24} height={24} />
                ) : (
                  <Image src="/img/icons/eye-view.svg" alt="eye-slash" width={24} height={24} />
                )}
              </button>
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showConfirmPassword ? "text" : "password"}
            isInvalid={!!confirmPassword && password !== confirmPassword}
            color={!confirmPassword ? "default" : password !== confirmPassword ? "danger" : "success"}
          />

          <Button className="btn text-white" type="submit">
            <div className="flex items-center justify-center gap-3">
              <Spinner className={`${loading ? 'block' : 'hidden'}`} size="sm" color="white" />
              <span>Restablecer Contraseña</span>
            </div>
          </Button>
          {message && <p className={`text-black text-center`}>{message}</p>}
        </div>
      </form>
    </div>
  );
} 