jQuery(document).ready(function () {
    $('#schoolTable').dataTable({
        paging: false,
        info: false,
        order: [[ 2, 'asc' ], [ 1, 'asc' ]]
    });
});

