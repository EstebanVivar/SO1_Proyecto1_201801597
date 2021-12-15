#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/hugetlb.h>
#include <linux/sched.h>
#include <linux/mm.h> // get_mm_rss()

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo Memoria CPU");
MODULE_AUTHOR("CARLOS ESTEBAN VIVAR TORRES");

struct task_struct *task;

struct task_struct *task_child;
struct list_head *list;

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    long rss;
    long mb;
    bool esPadre;

    bool conhijos;
    bool first;

    bool Aux = true;
    seq_printf(archivo, "{\"root\":[");
    for_each_process(task)
    {
        first = true;

        if (task->mm)
        {
            rss = get_mm_rss(task->mm) << PAGE_SHIFT;
            mb = rss / 1048576;
            if (Aux)
            {
                seq_printf(archivo, "{\n\t\"pid\":%d,\n\t\"nombre\":\"%s\",\n\t\"ram\":%ld,\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"hijos\":[", 
                                      task->pid,            task->comm,         mb,             task->sessionid,        task->state     );
                Aux = false;
            }
            else{
            seq_printf(archivo, ",{\n\t\"pid\":%d,\n\t\"nombre\":\"%s\",\n\t\"ram\":%ld,\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"hijos\":[", 
            task->pid, task->comm, mb,task->sessionid,        task->state);
            }
            esPadre = true;
        }
        else
        {
            if (Aux)
            {
                seq_printf(archivo, "{\n\t\"pid\":%d,\n\t\"nombre\":\"%s\",\n\t\"ram\": 0,\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"hijos\":[", 
                task->pid, task->comm,task->sessionid,        task->state);
                Aux = false;
            }
            else
            {
                seq_printf(archivo, ",{\n\t\"pid\":%d,\n\t\"nombre\":\"%s\",\n\t\"ram\": 0,\n\t\"usuario\":\"%d\",\n\t\"estado\":\"%ld\",\n\t\"hijos\":[", 
                task->pid, task->comm,task->sessionid,        task->state);
            }
            esPadre = true;
        }
        conhijos = false;
        list_for_each(list, &task->children)
        {
            seq_printf(archivo, "\n\t\t");
            task_child = list_entry(list, struct task_struct, sibling);
            // seq_printf(archivo, "\tProceso Hijo %s (pid: %d)\n",task_child->comm, task_child->pid )
            if (task_child->mm)
            {
                conhijos = true;
                rss = get_mm_rss(task_child->mm) << PAGE_SHIFT;
                mb = rss / 1048576;
                if (first)
                {
                    seq_printf(archivo, "\t{\"pid\": %d, \"nombre\": \"%s\", \"estado\": \"%ld\" ,\"ram\": %ld}",
                               task_child->pid, task_child->comm, task_child->state, mb);
                    first = false;
                }
                seq_printf(archivo, ",\t{\"pid\": %d, \"nombre\": \"%s\", \"estado\": \"%ld\" ,\"ram\": %ld}",
                           task_child->pid, task_child->comm, task_child->state, mb);
            }
            else
            {
                conhijos = true;
                if (first)
                {
                    seq_printf(archivo, "\t{\"pid\": %d, \"nombre\": \"%s\", \"estado\": \"%ld\",\"ram\": 0}",
                               task_child->pid, task_child->comm, task_child->state);
                    first = false;
                }
                seq_printf(archivo, ",\t{\"pid\": %d, \"nombre\": \"%s\", \"estado\": \"%ld\",\"ram\": 0}",
                           task_child->pid, task_child->comm, task_child->state);
            }
        }
        if (esPadre && conhijos)
        {
            seq_printf(archivo, "\n\t\t]\n}\n");
        }
        else if (esPadre)
        {
            seq_printf(archivo, "]\n}\n");
        }
        else
        {
            seq_printf(archivo, "},\n");
        }
    }
    seq_printf(archivo, "]}");

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
        .proc_read = seq_read};

static int _insert(void)
{
    proc_create("cpu_201801597", 0, NULL, &operaciones);
    printk(KERN_INFO "CARLOS ESTEBAN VIVAR TORRES\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("cpu_201801597", NULL);
    printk(KERN_INFO "DICIEMBRE 2021\n");
}

module_init(_insert);
module_exit(_remove);