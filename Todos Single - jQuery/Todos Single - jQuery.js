const PAGE={
    data: {
        todos: [{
            title: '跑步',
            completed: false
        },{
            title: '游泳',
            completed: false
        },{
            title: '背单词',
            completed: true
        }],
        filters: {
            1: '全部',
            2: '待办',
            3: '已办'
        },
        filter: 1,
    },
    init: function(){
        this.bind();
        this.getTodos();
    },
    bind: function(){
        $(".todos-arrow").toggle(this.slideDown,this.slideUp);
        $(".todos-input").keyup(this.addTodo);
        $(".todos-list").on("click",".todo-item-hd",this.toggleTodo);
        $(".todos-list").delegate(".todo-item-ft","click",this.removeTodo);
        $(".filter-item").live("click",this.filterTodo);
        $(".filter-ft").click(this.removeFinish);
        $(window).unload(this.saveTodos);
    },
    slideUp: function(){
        $(".todos-show").slideUp(1000);
        $(this).css({"border-top":"2px solid#BBBBBB","border-left":"2px solid #BBBBBB","transform":"rotate(45deg)","top":"50%","transition":"all,.5s"});
    },
    slideDown: function(){
        $(".todos-show").slideDown(1000);
        $(this).css({"border-top":"2px solid #222222","border-left":"2px solid #222222","transform":"rotate(-135deg)","top":"40%","transition":"all,.5s"});
    },
    render: function(){
        let todos=PAGE.data.todos;
        let filters=PAGE.data.filters;
        let filter=PAGE.data.filter;
        todos.forEach((date,index)=>date.index=index);
        let showTodos;
        switch(filter){
            case 2:
                showTodos=todos.filter(data => !data.completed);
                break;
            case 3:
                showTodos=todos.filter(data => data.completed);
                break;
            default:
                showTodos=todos;
                break;
        };
        let todosElement=showTodos.map((data)=>{
            return `
                <div class="todo-item${data.completed ? ' active' : ''}" data-index="${data.index}">
                    <div class="todo-item-hd"></div>
                    <div class="todo-item-bd">${data.title}</div>
                    <div class="todo-item-ft">✖</div>
                </div>
            `
        }).join('');
        let filtersElement=Object.keys(filters).map((key)=>{
            return `<div class="filter-item${key==filter ? ' active' : ''}" data-id="${key}">${filters[key]}</div>`
        }).join('');
        $(".todos-list").html(todosElement);
        $(".filter-bd").html(filtersElement);
        $(".filter-num").text(showTodos.length);
    },
    addTodo: function(event){
        let value=this.value.trim();
        if(event.which!==13 || !value){
            return;
        }else{
            let todos=PAGE.data.todos;
            todos.push({
                title: value,
                completed: false
            });
            PAGE.render();
            this.value='';
        }
    },
    toggleTodo: function(event){
        let todos=PAGE.data.todos;
        let todoItem=event.target.parentNode;
        let index=todoItem.dataset.index;
        todos[index].completed=!todos[index].completed;
        PAGE.render();
    },
    removeTodo: function(event){
        let todos=PAGE.data.todos;
        let todoItem=event.target.parentNode;
        let index=todoItem.dataset.index;
        todos.splice(index,1);
        PAGE.render();
    },
    filterTodo: function(event){
        let filter=event.target.dataset.id;
        PAGE.data.filter=Number(filter);
        PAGE.render();
    },
    removeFinish: function(){
        let todos=PAGE.data.todos;
        for(i=0;i<=todos.length;i++){
            console.log(todos[i].completed)
            console.log(i)
            if(todos[i].completed){
                todos.splice(i--,1);
                console.log(i)
            }
        };
        // todos.forEach(function(todo,index,todos){
        //     console.log(todo.completed)
        //     console.log(index)
        //     if(todo.completed){
        //         todos.splice(index,1);
        //         console.log(index)
        //         index--;
        //         console.log(index)
        //     }
        // });
        PAGE.render();
    },
    saveTodos: function(){
        let todos=PAGE.data.todos;
        todosStr=JSON.stringify(todos);
        localStorage.setItem('todos',todosStr);
    },
    getTodos: function(){
        let todos=localStorage.getItem('todos');
        todos=JSON.parse(todos) || [];
        PAGE.data.todos=todos;
        PAGE.render();
    }
}
PAGE.init();