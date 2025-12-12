# Guía de Despliegue - Aplicación React (UAD10)

## 📋 Información del Servidor

- **Sistema Operativo:** CentOS Stream 9
- **Servidor Web:** Apache
- **IP Laravel (Backend):** 167.157.3.10
- **IP React (Frontend):** 167.157.3.11
- **Carpeta del Proyecto:** `/var/www/uad10`
- **Puerto Vite:** 5173

---

## 🚀 PARTE 1: Preparación del Servidor

### 1.1 Instalar Node.js en CentOS Stream 9
```bash
# Conectarse al servidor
ssh root@167.157.3.11

# Instalar Node.js 20.x (LTS recomendado)
sudo dnf module list nodejs
sudo dnf module enable nodejs:20
sudo dnf install nodejs -y

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x
```

### 1.2 Instalar Git
```bash
sudo dnf install git -y
git --version
```

### 1.3 Instalar PM2 (Gestor de procesos)
```bash
sudo npm install -g pm2
pm2 --version
```

---

## 📦 PARTE 2: Subir el Proyecto React al Servidor

### Opción A: Usando Git (Recomendado)
```bash
# En el servidor, crear directorio para React
sudo mkdir -p /var/www/uad10
sudo chown $USER:$USER /var/www/uad10
cd /var/www/uad10

# Clonar tu repositorio
git clone https://tu-repositorio.git .
```

### Opción B: Subir archivos manualmente

**Desde tu computadora local:**
```bash
# Comprimir tu proyecto React (sin node_modules)
cd /ruta/local/proyecto-uad10
tar -czf uad10.tar.gz --exclude=node_modules --exclude=.git --exclude=dist .

# Subir al servidor usando SCP
scp uad10.tar.gz root@167.157.3.11:/tmp/
```

**En el servidor:**
```bash
sudo mkdir -p /var/www/uad10
sudo chown $USER:$USER /var/www/uad10
cd /var/www/uad10
tar -xzf /tmp/uad10.tar.gz
rm /tmp/uad10.tar.gz
```

### 2.1 Instalar dependencias
```bash
cd /var/www/uad10
npm install
```

---

## ⚙️ PARTE 3: Configurar Vite

### 3.1 Actualizar `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acceso desde cualquier IP
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://167.157.3.10', // Laravel backend
        changeOrigin: true,
        secure: false,
      }
    },
    hmr: {
      host: '167.157.3.11',
      protocol: 'ws',
      port: 5173
    },
    watch: {
      usePolling: true, // Importante para servidores
    }
  }
})
```

### 3.2 Actualizar archivo `.env` (si existe)
```bash
# En /var/www/uad10/.env
VITE_API_URL=http://167.157.3.10/api
```

---

## 🔧 PARTE 4: Configurar PM2 para Auto-inicio

### 4.1 Crear archivo de configuración PM2
```bash
cd /var/www/uad10
nano ecosystem.config.js
```

**Contenido de `ecosystem.config.js`:**
```javascript
module.exports = {
  apps: [{
    name: 'uad10-dev',
    script: 'npm',
    args: 'run dev',
    cwd: '/var/www/uad10',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5173,
      HOST: '0.0.0.0'
    },
    error_file: '/var/log/pm2/uad10-error.log',
    out_file: '/var/log/pm2/uad10-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### 4.2 Crear directorio de logs
```bash
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2
```

### 4.3 Iniciar aplicación con PM2
```bash
cd /var/www/uad10

# Iniciar la aplicación
pm2 start ecosystem.config.js

# Verificar estado
pm2 status

# Ver logs en tiempo real
pm2 logs uad10-dev

# Si todo está OK, guardar configuración para auto-inicio
pm2 save
pm2 startup
# ⚠️ IMPORTANTE: Ejecuta el comando que te muestre PM2
```

---

## 🌐 PARTE 5: Configurar Apache como Proxy Reverso

### 5.1 Habilitar módulos de Apache
```bash
# Instalar mod_ssl
sudo dnf install mod_ssl -y

# Editar configuración de módulos
sudo nano /etc/httpd/conf.modules.d/00-proxy.conf
```

Asegúrate de que estas líneas estén descomentadas:
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule rewrite_module modules/mod_rewrite.so
```

### 5.2 Crear configuración de VirtualHost
```bash
sudo nano /etc/httpd/conf.d/uad10.conf
```

**Contenido de `/etc/httpd/conf.d/uad10.conf`:**
```apache
<VirtualHost *:80>
    ServerName 167.157.3.11

    # Logs
    ErrorLog /var/log/httpd/uad10-error.log
    CustomLog /var/log/httpd/uad10-access.log combined

    # Proxy para Vite
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    # WebSocket para HMR (Hot Module Replacement)
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://localhost:5173/$1 [P,L]
    RewriteCond %{HTTP:Upgrade} !=websocket [NC]
    RewriteRule /(.*) http://localhost:5173/$1 [P,L]

    # Proxy principal
    ProxyPass / http://localhost:5173/
    ProxyPassReverse / http://localhost:5173/

    # Timeout para desarrollo
    ProxyTimeout 300
</VirtualHost>
```

### 5.3 Verificar y reiniciar Apache
```bash
# Verificar sintaxis
sudo apachectl configtest

# Si todo está OK, reiniciar
sudo systemctl restart httpd

# Verificar estado
sudo systemctl status httpd
```

---

## 🔒 PARTE 6: Configurar Firewall
```bash
# Verificar firewall activo
sudo firewall-cmd --state

# Permitir tráfico HTTP y HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Recargar firewall
sudo firewall-cmd --reload

# Verificar reglas
sudo firewall-cmd --list-all
```

---

## 🛡️ PARTE 7: Configurar SELinux
```bash
# Permitir que Apache haga proxy
sudo setsebool -P httpd_can_network_connect 1

# Verificar contexto SELinux
sudo semanage port -l | grep http_port_t
```

---

## ✅ PARTE 8: Verificación y Testing

### 8.1 Verificar que todo está corriendo
```bash
# Ver estado de PM2
pm2 status

# Ver logs de React
pm2 logs uad10-dev --lines 50

# Ver estado de Apache
sudo systemctl status httpd

# Probar conectividad local
curl http://localhost:5173

# Probar desde Apache
curl http://167.157.3.11
```

### 8.2 Comandos útiles de PM2
```bash
# Ver logs en tiempo real
pm2 logs uad10-dev

# Reiniciar aplicación
pm2 restart uad10-dev

# Detener aplicación
pm2 stop uad10-dev

# Iniciar aplicación
pm2 start uad10-dev

# Ver información detallada
pm2 show uad10-dev

# Monitoreo en tiempo real
pm2 monit
```

---

## 🔄 PARTE 9: Script de Actualización

### 9.1 Crear script de actualización
```bash
nano /var/www/uad10/update.sh
```

**Contenido de `update.sh`:**
```bash
#!/bin/bash

echo "🔄 Actualizando aplicación UAD10..."

cd /var/www/uad10

# Si usas Git
echo "📥 Descargando cambios..."
git pull

# Instalar nuevas dependencias
echo "📦 Instalando dependencias..."
npm install

# Reiniciar PM2
echo "🔄 Reiniciando aplicación..."
pm2 restart uad10-dev

# Ver logs
echo "📋 Logs recientes:"
pm2 logs uad10-dev --lines 20 --nostream

echo "✅ Actualización completada!"
```

### 9.2 Dar permisos de ejecución
```bash
chmod +x /var/www/uad10/update.sh

# Para actualizar en el futuro:
./update.sh
```

---

## 🐛 PARTE 10: Solución de Problemas Comunes

### Problema 1: "EACCES: permission denied"
```bash
sudo chown -R $USER:$USER /var/www/uad10
chmod -R 755 /var/www/uad10
```

### Problema 2: PM2 no inicia al reiniciar servidor
```bash
# Regenerar startup script
pm2 unstartup
pm2 startup
# ⚠️ Ejecutar el comando que te muestre PM2
pm2 save
```

### Problema 3: Apache no puede conectar a puerto 5173
```bash
# Verificar SELinux
sudo setsebool -P httpd_can_network_connect 1

# Verificar que Vite está escuchando en 0.0.0.0
sudo netstat -tlnp | grep 5173
```

### Problema 4: HMR (Hot Reload) no funciona

Actualiza `vite.config.js`:
```javascript
hmr: {
  host: '167.157.3.11',
  port: 5173,
  protocol: 'ws'
}
```

### Problema 5: Error de conexión con API

Verifica en el navegador (Consola F12):
- La URL de la API en las peticiones
- Configuración de CORS en Laravel
- Que Laravel esté accesible desde `http://167.157.3.10`

---

## 📋 Checklist Final

Verifica que todo esté completado:

- [ ] Node.js instalado (`node --version`)
- [ ] PM2 instalado (`pm2 --version`)
- [ ] Git instalado (`git --version`)
- [ ] Proyecto React en `/var/www/uad10`
- [ ] Dependencias instaladas (`npm install` completado)
- [ ] `vite.config.js` configurado
- [ ] `.env` configurado (si existe)
- [ ] `ecosystem.config.js` creado
- [ ] PM2 ejecutándose (`pm2 status`)
- [ ] PM2 auto-inicio configurado (`pm2 startup` y `pm2 save`)
- [ ] Módulos de Apache habilitados
- [ ] Archivo `/etc/httpd/conf.d/uad10.conf` creado
- [ ] Apache reiniciado (`sudo systemctl restart httpd`)
- [ ] Firewall configurado
- [ ] SELinux configurado
- [ ] Aplicación accesible desde `http://167.157.3.11`
- [ ] Script de actualización creado y con permisos

---

## 🌐 Acceso Final

### URLs de Acceso

- **Frontend (React):** http://167.157.3.11
- **Backend (Laravel API):** http://167.157.3.10/api

### Comandos de Monitoreo Diario
```bash
# Ver estado general
pm2 status

# Ver logs en tiempo real
pm2 logs uad10-dev

# Ver uso de recursos
pm2 monit

# Reiniciar si hay problemas
pm2 restart uad10-dev

# Ver logs de Apache
sudo tail -f /var/log/httpd/uad10-error.log
```

---

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. Revisa los logs de PM2: `pm2 logs uad10-dev`
2. Revisa los logs de Apache: `sudo tail -f /var/log/httpd/uad10-error.log`
3. Verifica el estado de los servicios: `pm2 status` y `sudo systemctl status httpd`
4. Asegúrate de que el firewall y SELinux estén correctamente configurados

---

## 📝 Notas Importantes

- Esta configuración mantiene el servidor de desarrollo de Vite corriendo permanentemente
- El Hot Module Replacement (HMR) estará activo para facilitar el desarrollo
- PM2 reiniciará automáticamente la aplicación si se cierra inesperadamente
- Para producción final, se recomienda hacer `npm run build` y servir archivos estáticos
- Mantén backups regulares del proyecto
- Documenta cualquier cambio adicional en la configuración

---

**Última actualización:** Diciembre 2024