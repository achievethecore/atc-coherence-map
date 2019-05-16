import React, { Component, Fragment } from 'react';
var classNames = require('classnames');

import BreadcrumdModeling from '../breadcrumb-modeling/breadcrumd-modeling';

// Styles
import '../../../scss/modeling.scss';
import './modeling-tasks.scss';

class ModelingTasks extends Component {
  state = {
    type: 'list',
    coursers: null,
  }

  componentDidMount() {
    let modeling_courses = _(window.cc.modeling_tasks.ela_course).sortBy('order_number').value();
    let modeling_subjects = _(window.cc.modeling_tasks.ela_subject).sortBy('order_number').value();
    let modeling_tasks = [];
    modeling_courses.forEach(course => {
      modeling_subjects.forEach(subject => {
        let _modeling_tasks = _(window.cc.modeling_tasks.tasks).pick(
          (x) => x.ccelacourse_id == course.id && 
          x.ccelasubject_id == subject.id
        ).sortBy('order_number').value();
        let _task = {
          course: course,
          subject: subject,
          tasks: _modeling_tasks
        }
        modeling_tasks.push(_task);
      });
    });

    this.setState({
      courses: modeling_tasks
    })
  }

  switchView = (_type) => {
    if (_type !==  this.state.type) {
      this.setState({
        type: _type
      });
    }
  }

  _readmore = (_action_task) => {
    let _courses = this.state.courses;
    _courses.map( (item) => {
      if (item.course && item.course.id === _action_task.ccelacourse_id) {
        item.tasks.map( (_task) => {
          if (_task.id === _action_task.id) {
            if (_task.isExpand) _task.isExpand = false;
            else _task.isExpand = true;
          }
        })
      }
    })
    this.setState({
      courses: _courses
    });
  }
  

  render() {
    const { onSelectStep } = this.props;
    let { courses } = this.state;
    let sum_tasks = _.reduce(courses, function (result, course) {
      return result + ( (course.tasks && course.tasks.length) ? course.tasks.length : 0);
    }, 0);

    return (
      <div className='domain-page'>
        {(this.props && this.props.step !== 'landing') || this.props && (this.props.from && this.props.from.category)
          ? <BreadcrumdModeling step={this.props.step} onSelectStep={onSelectStep} from={this.props.from} />
          : null
        }
        <div className='modeling-wrapper'>
          <div>
            <div className='modeling-container modeling-tasks-page'>
              <div className="tasks-header">
                <h2 className="page-name">Modeling Tasks</h2>
                <p>
                  The modeling tasks have been organized by courses. 
                  The selection of tasks for each course represent different levels of modeling, 
                  different aspects of the modeling cycle, and content that appropriately ranges 
                  from middle school to high school. Note that tasks designated for a given course 
                  would also be appropriate in any subsequent course. Consider adding several of 
                  these tasks to your course curriculum for the year. For example, each quarter of 
                  instruction could feature one of the tasks.
                </p>
                <p>Student Achievement Partners is looking for high-quality tasks for the Coherence Map. Please send 
                  any suggestions, along with the source of the task and any annotations, to 
                  <a href="mailto:modelingtasks@studentsachieve.net" target="_top" className='mailto'> modelingtasks@studentsachieve.net.</a>
                </p>
              </div>
              <div className='task-list'>
                <div className='top-container'>
                  <span className='number-tasks'>{sum_tasks > 1 ? `${sum_tasks} Tasks` : `${sum_tasks} Task` }</span>
                  <div className='type-view-options'>
                    <button 
                      className={ classNames('list', {'active': this.state.type === 'list'}) } 
                      onClick={() => this.switchView('list')}>
                      <img src="/coherence-map/images/icon/list.svg" />
                    </button>
                    <button className={ classNames('grid', {'active': this.state.type === 'grid'}) } 
                      onClick={ () => this.switchView('grid') }>
                      <img src="/coherence-map/images/icon/grid.svg" />
                    </button>
                  </div>
                </div>
                <div className="content-container">
                  { courses &&
                    courses.map((modeling_task, i) => {
                      return (modeling_task && modeling_task.tasks && modeling_task.tasks.length) ?
                      <div className={classNames('course-block', {'grid': this.state.type === 'grid'})} key={ i }>
                        <h4 className="section-name">{ modeling_task.course.name }  |  { modeling_task.subject.name }</h4>
                        <div className='course-items'>
                          { modeling_task.tasks.map((task, j) => {
                              return(
                                <div className='course-item' key={j}>
                                  <div className='course-info'>
                                    <h3>{ task.name }</h3>
                                    <p className='source-info'>
                                      <span>Source:</span>
                                      <a href={task.source_url} target="_blank">{ task.source_name }</a>
                                    </p>
                                    { (task.isExpand || this.state.type === 'grid') &&
                                      (<div className="description-wrap">
                                        <p className='des-course'>
                                          { task.description }
                                        </p>
                                      </div>)
                                    }
                                    
                                  </div>
                                  <div className='more-info'>
                                    { this.state.type === 'list' &&
                                      (<a className='readmore' onClick={ () => this._readmore(task) }>
                                        { task.isExpand ? 'Read Less' : 'Read More' }
                                      </a>)
                                    }
                                    <a className='download-btn' href={task.download_url} target="_blank">Download <i className="icon-down"></i></a>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                      : null
                      }
                    )
                  }
                </div>
              </div>
            </div>
            <div className='bottom-container'>
              <div className="node">
                <button onClick={() => onSelectStep('landing')}>View Modeling Homepage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModelingTasks;