//Header obligatorio de todos los modulos
#include <linux/module.h>
//Header para usar KERN_INFO
#include <linux/kernel.h>

//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>
#include <linux/hugetlb.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo Memoria Ram");
MODULE_AUTHOR("Carlos Esteban Vivar Torres");

struct sysinfo inf;

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int escribir_archivo(struct seq_file *archivo, void *v)
{   
    unsigned long memoria_total;
    unsigned long memoria_libre;
    unsigned long memoria_buffer;
    unsigned long memoria_usada;
    unsigned long porcentaje;
    
    si_meminfo(&inf);
    memoria_total = inf.totalram *inf.mem_unit/1048576;
    memoria_libre = inf.freeram *inf.mem_unit/1048576;
    memoria_buffer = inf.bufferram *inf.mem_unit/1048576;
    memoria_usada = memoria_total-(memoria_libre+memoria_buffer);
    porcentaje=(memoria_usada*100)/memoria_total;

    seq_printf(archivo, "{\"total\":\"%li\",\n", memoria_total);
    seq_printf(archivo, "\"used\":\"%li\",\n", memoria_usada);
    seq_printf(archivo, "\"percent\":\"%li\"}", porcentaje);
    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

/*Si el kernel es menor al 5.6 usan file_operations
static struct file_operations operaciones =
{
    .open = al_abrir,
    .read = seq_read
};
*/

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("memo_201801597", 0, NULL, &operaciones);
    printk(KERN_INFO "201801597\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("memo_201801597", NULL);
    printk(KERN_INFO "SISTEMAS OPERATIVOS 1\n");
}

module_init(_insert);
module_exit(_remove);