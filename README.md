# [SO1] PROYECTO 1
## DATOS DEL ESTUDIANTE
### Curso: Sistemas Operativos 1
### Nombre: Carlos Esteban Vivar Torres	
### Carnet: 201801597

## Librerias utilizadas
* Obligatoria para los modulos de linux
    ```c
    #include <linux/module.h>  
    ```
* Para utilizar informacion del kernel
    ```c
    #include <linux/module.h>
    ```
* Para utilizar la inicializacion y salida de modulos con los macros module_init y module_exit
    ```c
    #include <linux/init.h>
    ```

* Para utilizar el sistema de archivos virtual del directorio `/proc`
    ```c
    #include <linux/proc_fs.h>
    
    /* for copy_from_user */
    #include <asm/uaccess.h>
    // Para manejar el archivo en /proc
    #include <linux/seq_file.h>
    #include <linux/hugetlb.h>
    ```


Para utilizar el struct de procesos o tareas (tasks) y el comsumo de ram de dichos procesos
    ```c
    #include <linux/sched.h>
    #include <linux/mm.h>  
    ```


## Informacion de la estructura
* **RAM - sysinfo**
    Es una estructura que retorna informacion del sistema, principalmente informacion sobre la memoria RAM y Swap del sistema. La estructura es la siguiente:
    ```c
        struct sysinfo {
               long uptime;             /* Tiempo en segundos desde el arranque del sistema */
               unsigned long loads[3];  /* Promedios de carga de CPU de 1, 5 y 15 minutos  */
               unsigned long totalram;  /* Cantidad total de la memoria principal utilizable */
               unsigned long freeram;   /* Cantidad de memoria sin utilizar */
               unsigned long sharedram; /* Cantidad de memoria compartida */
               unsigned long bufferram; /* Cantidad de memoria empleada por búferes */
               unsigned long totalswap; /* Cantidad total de memoria Swap */
               unsigned long freeswap;  /* Cantidad de Swap disponible */
               unsigned short procs;    /* Número de procesos actuales */
               char _f[22];             /* Rellena la struct a 64 bytes */
              };
    ```

* **CPU - Task_struct**
En Linux, a cada proceso se le asigna dinámicamente una estructura llamada task_struct, esta
estructura cuenta con diversos atributos que permiten identificar cada proceso, ademas de los recursos que utiliza y consume en el sistema.

En este proyecto se utilizaron solamente los siguientes atributos:
```c
task->mm: Retorna la cantidad de memoria RAM que utiliza un proceso.
task-> pid: Retorna el numero identificador del proceso.
task->comm: Retorna el nombre del proceso.
task->real_cred->uid: Retorna el codigo del usuario al que pertenece el proceso.
task->state: Retorna el estado del proceso.
task->children: Retorna los hijos de un proceso.
```

## Funciones Utilizadas
* **escribir_archivo:** Se utilizo para escribir informacion dentro de un archivo con estructura seq_file, la cual es retornada cuando el modulo es ejecutado. La informacion en el caso de la ram, fueron la memoria total, la memoria libre, la memoria de buffer y la memoria compartida.
![](https://i.imgur.com/NQUaoHi.png)



* **al_abrir:** Esta funcion es la que retorna la inforacion escrita en el archivo con estructura seq_file.
![](https://i.imgur.com/9eB0e3k.png)

* **_insert:** Esta funcion se ejecuta cuando se inserta el modulo en el kernel de linux utilizando el comando `insmod`.
![](https://i.imgur.com/R9NyoAA.png)

* **_remove:** Esta funcion se ejecuta cuando se remueve el modulo del kernel de linux utilizando el comando `rmmod`.
![](https://i.imgur.com/GuoDXcR.png)


## Comandos utilizados
* **make:** Genera los archivos necesarios para la crear el modulo a insertar. 
![](https://i.imgur.com/H87AhrI.png)

* **make clean:** Elimina los archivos generados por la ejecucion de un comando make. 
![](https://i.imgur.com/QdzfO72.png)

* **insmod:** Inserta el modulo especificado al kernel de linux en ejecucion. Necesita permisos de superusuario o root.
    ```
    sudo insmod <module_name.ko>
    ```
    ![](https://i.imgur.com/8aGzuP2.png)

* **rmmod:** Remueve el modulo especificado del kernel de linux en ejecucion, el modulo debe estar insertado en el kernel. Necesita permisos de superusuario o root.
    ```
    sudo rmmod <module_name.ko>
    ```
    ![](https://i.imgur.com/iFplCNX.png)

* **dmesg:** Muestra los mensajes de diagnostico alojados en el bufer.
![](https://i.imgur.com/yYcSK6i.png)

* **lsmod:** Enlista todos los modulos insertados en el modulo en ejecucion del sistema Linux.
![](https://i.imgur.com/EiUWoQd.png)
