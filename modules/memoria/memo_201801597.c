#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>	
#include <linux/seq_file.h>
#include <linux/hugetlb.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo Memoria Ram");
MODULE_AUTHOR("Carlos Esteban Vivar Torres");

struct sysinfo inf;

static int escribir_archivo(struct seq_file *archivo, void *v)
{   
    unsigned long memoria_total;
    unsigned long memoria_libre;
    unsigned long memoria_buffer;
    unsigned long memoria_compartida;
    
    si_meminfo(&inf);
    memoria_total = inf.totalram *inf.mem_unit/1048576;
    memoria_libre = inf.freeram *inf.mem_unit/1048576;
    memoria_buffer = inf.bufferram *inf.mem_unit/1048576;
    memoria_compartida = inf.sharedram *inf.mem_unit/1048576;

    seq_printf(archivo, "{\"total\":%li,\n", memoria_total);
    seq_printf(archivo, "\"free\":%li,\n", memoria_libre);
    seq_printf(archivo, "\"buffer\":%li,\n", memoria_buffer);
    seq_printf(archivo, "\"shared\":%li}", memoria_compartida);
    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("memo_201801597", 0, NULL, &operaciones);
    printk(KERN_INFO "201801597\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("memo_201801597", NULL);
    printk(KERN_INFO "SISTEMAS OPERATIVOS 1\n");
}

module_init(_insert);
module_exit(_remove);